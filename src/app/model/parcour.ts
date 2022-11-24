export interface ParcourElementJson {
	length: number;
	curve?: number;
}

export class ParcourElement {

	public readonly curve: number | undefined;

	get isCurve(): boolean {
		return this.curve !== undefined;
	}

	constructor(public readonly length: number, public readonly x: number, public readonly y: number, public readonly orientation: number, curve?: number) {
		this.curve = curve;
	}

	static load(json: ParcourElementJson): ParcourElement {
		return new ParcourElement(json.length, json.curve);
	}

	getCurve(relPosition: number): number | undefined {
		if (this.curve === undefined) {
			return undefined;
		}
		if (this.length > 1) {
			return this.curve;
		}
		return relPosition === 1 ? this.curve : undefined;
	}

	save(): ParcourElementJson {
		return {
			length: this.length,
			curve: this.curve
		};
	}
}

export interface ParcourJson {
	version: 1;
	rounds: number;
	elements: ParcourElementJson[];
}

export class Parcour {

	rounds = 1;

	private _curvesCache: Array<number | undefined> | undefined;
	private _elements: ParcourElement[] = [new ParcourElement(4, 0, 0, 0)];

	get elements(): ParcourElement[] {
		return this._elements.slice(0);
	}

	get fields(): number {
		this.ensureCurvesCache();
		return this._curvesCache.length;
	}

	get length(): number {
		return this._elements.length;
	}

	appendStraight(length: number): void {
		const last = this._elements[this._elements.length - 1];
		this._elements.push(new ParcourElement(length));
		this._curvesCache = undefined;
	}

	appendCurve(length: number, curve: number): void {
		const last = this._elements[this._elements.length - 1];
		this._elements.push(new ParcourElement(length, curve));
		this._curvesCache = undefined;
	}

	clear(): void {
		this._elements = [new ParcourElement(4, 0, 0, 0)];
		this._curvesCache = undefined;
	}

	getCurve(position: number): number | undefined {
		this.ensureCurvesCache();
		return this._curvesCache[position % this._curvesCache.length];
	}

	insert(index: number, element: ParcourElement): void {
		this._elements.splice(index, 0, element);
		this._curvesCache = undefined;
	}

	load(json: ParcourJson): void {
		this.rounds = json.rounds;
		this._elements = json.elements.map(el => ParcourElement.load(el));
		this._curvesCache = undefined;
	}

	remove(index: number): void {
		this._elements.splice(index, 1);
		this._curvesCache = undefined;
	}

	replace(index: number, element: ParcourElement): void {
		this._elements[index] = element;
		this._curvesCache = undefined;
	}

	save(): ParcourJson {
		return {
			version: 1,
			rounds: this.rounds,
			elements: this._elements.map(el => el.save())
		};
	}

	private ensureCurvesCache(): void {
		if (this._curvesCache === undefined) {
			this._curvesCache = [];
			this._elements.forEach(el => {
				if (el.isCurve && el.length === 1) {
					this._curvesCache.push(undefined, el.curve, undefined);
				} else {
					for (let i = 0; i < el.length; ++i) {
						this._curvesCache.push(el.curve);
					}
				}
			});
		}
	}
}