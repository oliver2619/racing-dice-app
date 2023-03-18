import { CarPositionInfo } from "./car-position-info";
import { FieldInfo } from "./field-info";
import { ParcourElement } from "./parcour-element";
import { ParcourElementCurve } from "./parcour-element-curve";
import { ParcourElementInfo } from "./parcour-element-info";
import { ParcourElementStraight } from "./parcour-element-straight";
import { ParcourInfo } from "./parcour-info";
import { ParcourJson, ParcourJson2 } from "./parcour-json";
import { CurveLength, CurveTurn, StraightLength, ParcourElementRotation, Lane } from "./parcour-types";

export class Parcour implements ParcourInfo {

	rounds = 1;

	private _curvesCache: Array<number | undefined> | undefined;
	private _elements: ParcourElement[] = [this.createStartElement()];

	get elements(): ParcourElementInfo[] {
		return this._elements.slice(0);
	}

	get fields(): number {
		this.ensureCurvesCache();
		return this._curvesCache!.length;
	}

	get isComplete(): boolean {
		if (this._elements.length < 6) {
			return false;
		}
		if (this._elements[this._elements.length - 1].endDirection !== this._elements[0].rotation) {
			return false;
		}
		const c = this.getStraightInsertPosition(this._elements.length - 1, 4);
		return c.x === this._elements[0].x && c.y === this._elements[0].y;
	}

	get isEmpty(): boolean {
		return this._elements.length < 2;
	}

	get numberOfElements(): number {
		return this._elements.length;
	}

	get startElementRotation(): ParcourElementRotation {
		return this._elements[0].rotation;
	}

	appendCurve(afterIndex: number, length: CurveLength, speed: number, turn: CurveTurn): void {
		this._appendCurve(afterIndex, length, speed, turn);
		this.rearangeTail(afterIndex + 2);
		this._curvesCache = undefined;
	}

	appendStraight(afterIndex: number, length: StraightLength): void {
		this._appendStraight(afterIndex, length);
		this.rearangeTail(afterIndex + 2);
		this._curvesCache = undefined;
	}

	clear(): void {
		this._elements = [this.createStartElement()];
		this.rounds = 1;
		this._curvesCache = undefined;
	}

	getCurve(position: number): number | undefined {
		this.ensureCurvesCache();
		return this._curvesCache![position % this._curvesCache!.length];
	}

	getField(position: CarPositionInfo): FieldInfo {
		return this._elements[position.tile].getField(position.field, position.lane);
	}

	getFirstTurn(): CurveTurn | undefined {
		return this._elements.find(e => e.isCurve)?.curveTurn;
	}

	getStartPosition(position: number): CarPositionInfo {
		let lane = this.getFirstTurn() === CurveTurn.LEFT ? Lane.LEFT : Lane.RIGHT;
		if ((position & 1) === 0) {
			lane = 1 - lane;
		}
		let tile = 0;
		let field = 2 - position;
		while (field < 0) {
			if (tile === 0) {
				tile = this._elements.length - 1;
			} else {
				tile = tile - 1;
			}
			field += this._elements[tile].getLaneLength(lane);
		}
		return { field, lane, tile };
	}

	load(json: ParcourJson): void {
		this.clear();
		if (json.version === 1) {
			return;
		}
		const json2 = json as ParcourJson2;
		this.rounds = json2.rounds;
		this._elements[0] = this._elements[0].withRotation(json2.rotation);
		json2.elements.forEach(el => {
			if (el.curve !== undefined) {
				this._appendCurve(this._elements.length - 1, el.length as CurveLength, el.curve.speed, el.curve.turn === 'l' ? CurveTurn.LEFT : CurveTurn.RIGHT);
			} else {
				this._appendStraight(this._elements.length - 1, el.length as StraightLength);
			}
		});
		this.rearrangeAroundNewCenter();
		this._curvesCache = undefined;
	}

	remove(i: number): void {
		if (i === 0) {
			throw new RangeError('Start tile can not be removed');
		}
		this._elements.splice(i, 1);
		this.rearangeTail(i);
		this._curvesCache = undefined;
	}

	rotateStartElement(rotation: ParcourElementRotation) {
		const json = this.save();
		json.rotation = rotation;
		this.load(json);
	}

	save(): ParcourJson2 {
		return {
			version: 2,
			rounds: this.rounds,
			rotation: this._elements[0].rotation,
			elements: this._elements.slice(1).map(el => el.save())
		};
	}

	setCurveSpeed(curve: number, speed: number) {
		const el = this._elements[curve];
		if (el instanceof ParcourElementCurve) {
			el.curveSpeed = speed;
		} else {
			throw new RangeError(`Element ${curve} is not a curve`);
		}
	}

	setElementLength(element: number, length: CurveLength | StraightLength) {
		const json = this.save();
		json.elements[element - 1].length = length;
		this.load(json);
	}

	private _appendCurve(afterIndex: number, length: CurveLength, speed: number, turn: CurveTurn) {
		const pos = this.getCurveInsertPosition(afterIndex, length, turn);
		const last = this._elements[afterIndex];
		const rotation = ((turn == CurveTurn.RIGHT ? 1 : 0) + last.endDirection) % 4;
		this._elements.splice(afterIndex + 1, 0, new ParcourElementCurve({
			length,
			rotation,
			endDirection: this.getCurveEndDirection(afterIndex, turn),
			x: pos.x,
			y: pos.y,
			curveSpeed: speed,
			curveTurn: turn
		}));
	}

	private _appendStraight(afterIndex: number, length: StraightLength) {
		const c = this.getStraightInsertPosition(afterIndex, length);
		this._elements.splice(afterIndex + 1, 0, new ParcourElementStraight({
			length,
			rotation: this.getStraightEndDirection(afterIndex),
			x: c.x,
			y: c.y
		}));
	}

	private createStartElement(): ParcourElement {
		return new ParcourElementStraight({
			length: 4,
			rotation: 0,
			x: 0,
			y: 0
		});
	}

	private ensureCurvesCache(): void {
		if (this._curvesCache === undefined) {
			this._curvesCache = [];
			this._elements.forEach(el => {
				if (el.isCurve && el.length === 1) {
					this._curvesCache!.push(undefined, el.curveSpeed, undefined);
				} else {
					for (let i = 0; i < el.length; ++i) {
						this._curvesCache!.push(el.curveSpeed);
					}
				}
			});
		}
	}

	private getCurveInsertPosition(afterTileIndex: number, length: CurveLength, turn: CurveTurn): { x: number, y: number } {
		const prev = this._elements[afterTileIndex];
		const sz = length === 4 ? 5 : 4;
		let x = prev.nextOffsetX;
		let y = prev.nextOffsetY;
		switch (prev.endDirection) {
			case ParcourElementRotation.UP:
				y -= sz;
				if (sz === 5 && turn === CurveTurn.LEFT) {
					--x;
				}
				break;
			case ParcourElementRotation.LEFT:
				x -= sz;
				if (sz === 5 && turn === CurveTurn.RIGHT) {
					--y;
				}
				break;
			case ParcourElementRotation.DOWN:
				if (sz === 5 && turn === CurveTurn.RIGHT) {
					--x;
				}
				break;
			case ParcourElementRotation.RIGHT:
				if (sz === 5 && turn === CurveTurn.LEFT) {
					--y;
				}
		}
		return { x, y };
	}

	private getCurveEndDirection(afterTileIndex: number, turn: CurveTurn): ParcourElementRotation {
		const last = this._elements[afterTileIndex];
		return turn == CurveTurn.RIGHT ? (last.endDirection + 3) % 4 : ((last.endDirection + 1) % 4);
	}

	private getElementInsertPosition(afterTileIndex: number, element: ParcourElement): { x: number, y: number } {
		if (element.isCurve) {
			return this.getCurveInsertPosition(afterTileIndex, (element as ParcourElementCurve).length, (element as ParcourElementCurve).curveTurn);
		} else {
			return this.getStraightInsertPosition(afterTileIndex, (element as ParcourElementStraight).length);
		}
	}

	private getElementEndDirection(afterTileIndex: number, element: ParcourElement): ParcourElementRotation {
		if (element.isCurve) {
			return this.getCurveEndDirection(afterTileIndex, (element as ParcourElementCurve).curveTurn);
		} else {
			return this.getStraightEndDirection(afterTileIndex);
		}
	}

	private getStraightInsertPosition(afterTileIndex: number, length: StraightLength): { x: number, y: number } {
		const prev = this._elements[afterTileIndex];
		let x = prev.nextOffsetX;
		let y = prev.nextOffsetY;
		switch (prev.endDirection) {
			case ParcourElementRotation.UP:
				y -= length;
				break;
			case ParcourElementRotation.LEFT:
				x -= length;
				break;
		}
		return { x, y };
	}

	private getStraightEndDirection(afterTileIndex: number): ParcourElementRotation {
		return this._elements[afterTileIndex].endDirection;
	}

	private rearangeTail(firstInvalidIndex: number) {
		for (let i = firstInvalidIndex; i < this._elements.length; ++i) {
			const pos = this.getElementInsertPosition(i - 1, this._elements[i]);
			this._elements[i] = this._elements[i].withPosition(pos.x, pos.y).withEndDirection(this.getElementEndDirection(i - 1, this._elements[i]));
		}
		this.rearrangeAroundNewCenter();
	}

	private rearrangeAroundNewCenter() {
		const minX = this._elements.reduce((prev, cur) => Math.min(prev, cur.x), this._elements[0].x);
		const minY = this._elements.reduce((prev, cur) => Math.min(prev, cur.y), this._elements[0].y);
		if (minX != 0 || minY != 0) {
			this._elements = this._elements.map(el => el.withPosition(el.x - minX, el.y - minY));
		}
	}
}