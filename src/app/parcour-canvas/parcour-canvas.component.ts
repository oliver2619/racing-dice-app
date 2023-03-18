import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarInfo } from '../model/car-info';
import { ParcourElementInfo } from '../model/parcour-element-info';
import { CurveTurn, Lane } from '../model/parcour-types';
import { Team } from '../model/teams';
import { ParcourService } from '../parcour/parcour.service';
import { RaceService } from '../race/race.service';

interface Tile {
	x: number;
	y: number;
	width: number;
	height: number;
	element: string;
	rot: string;
	endDirection: string;
	speed: string;
}

interface Piece {
	x: number;
	y: number;
	team: string;
	active: boolean;
}

interface ParcourAnimation {
	isFinished: boolean;
	animate: (timeout: number) => void;
}

const EASE_IN_OUT = (f: number) => 3 * f * f - 2 * f * f * f;

class ParcourScrollAnimation implements ParcourAnimation {

	private static readonly DURATION = 0.1;

	isFinished = false;

	private readonly startX: number;
	private readonly startY: number;

	private time = 0;

	constructor(private readonly scrollContainer: HTMLElement, private readonly targetX: number, private readonly targetY: number) {
		this.startX = scrollContainer.scrollLeft;
		this.startY = scrollContainer.scrollTop;
	}

	animate(timeout: number) {
		this.time += timeout;
		if (this.time >= ParcourScrollAnimation.DURATION) {
			this.time = ParcourScrollAnimation.DURATION;
			this.isFinished = true;
		}
		const f = EASE_IN_OUT(this.time / ParcourScrollAnimation.DURATION);
		this.scrollContainer.scrollTo(this.startX + (this.targetX - this.startX) * f, this.startY + (this.targetY - this.startY) * f);
	}
}

@Component({
	selector: 'app-parcour-canvas',
	templateUrl: './parcour-canvas.component.html',
	styleUrls: ['./parcour-canvas.component.scss']
})
export class ParcourCanvasComponent implements OnDestroy {

	@Input('race-mode')
	isRaceMode = false

	@Output('select')
	readonly onSelect = new EventEmitter<number | undefined>();

	tiles: Tile[] = [];

	private static readonly GRID_SIZE = 48;

	private readonly animations: ParcourAnimation[] = [];
	private readonly subscription: Subscription;
	private selection: number | undefined;
	private animation: number | undefined;

	get cars(): Piece[] {
		return this.isRaceMode ? this.raceService.cars.map(c => this.carToPiece(c)) : [];
	}

	get curves(): Tile[] {
		return this.parcourService.elements.filter(e => e.isCurve).map((e, i) => this.parcourElementToTile(e, i === 0));
	}

	get hasSelection(): boolean {
		return this.selection !== undefined && this.selection < this.parcourService.numberOfElements;
	}

	get selectedTile(): Tile | undefined {
		return this.selection !== undefined && this.selection < this.parcourService.numberOfElements ? this.parcourElementToTile(this.parcourService.elements[this.selection], false) : undefined;
	}

	get startTile(): Tile {
		return this.parcourElementToTile(this.parcourService.elements[0], true);
	}

	get editableTiles(): Tile[] {
		return this.isRaceMode ? [] : this.tiles.slice(1);
	}

	constructor(private readonly parcourService: ParcourService, private readonly raceService: RaceService, private readonly element: ElementRef<HTMLElement>) {
		this.subscription = parcourService.onChangeStructure.subscribe({ next: () => this.updateTiles() });
		this.updateTiles();
	}

	canInsertAfter(i: number): boolean {
		return i < this.tiles.length - 1 || !this.parcourService.isComplete;
	}

	ngOnDestroy(): void {
		if (this.animation !== undefined) {
			cancelAnimationFrame(this.animation);
			this.animation = undefined;
		}
		this.subscription.unsubscribe();
	}

	insertLeftCurve(i: number) {
		this.parcourService.appendCurve(i, 3, 15, CurveTurn.LEFT);
		this.scrollToTile(this.parcourService.numberOfElements - 1);
		if (this.selection != undefined && this.selection >= i) {
			this.selectTile(this.selection + 1);
		}
	}

	insertRightCurve(i: number) {
		this.parcourService.appendCurve(i, 3, 15, CurveTurn.RIGHT);
		this.scrollToTile(this.parcourService.numberOfElements - 1);
		if (this.selection != undefined && this.selection >= i) {
			this.selectTile(this.selection + 1);
		}
	}

	insertStraight(i: number) {
		this.parcourService.appendStraight(i, 4);
		this.scrollToTile(this.parcourService.numberOfElements - 1);
		if (this.selection != undefined && this.selection >= i) {
			this.selectTile(this.selection + 1);
		}
	}

	remove(i: number) {
		if (this.selection != undefined) {
			if (this.selection > i) {
				this.selectTile(this.selection - 1);
			} else if (this.selection === i && i === this.parcourService.numberOfElements - 1) {
				this.selectTile(undefined);
			}
		}
		this.parcourService.remove(i);
	}

	rotateLeft() {
		this.parcourService.rotateStartElement((this.parcourService.startElementRotation + 1) % 4);
		this.scrollToTile(0);
	}

	rotateRight() {
		this.parcourService.rotateStartElement((this.parcourService.startElementRotation + 3) % 4);
		this.scrollToTile(0);
	}

	selectTile(i: number | undefined) {
		if (!this.isRaceMode) {
			const s = i === undefined || (i > 0 && i !== this.selection) ? i : undefined;
			if (this.selection !== s) {
				this.selection = s;
				if (this.selection !== undefined) {
					this.scrollToTile(this.selection);
				}
				this.onSelect.emit(this.selection);
			}
		}
	}

	scrollToTile(tile: number) {
		const tileElement = this.parcourService.elements[tile];
		const container = this.element.nativeElement;
		const x = tileElement.x * ParcourCanvasComponent.GRID_SIZE - (container.clientWidth - tileElement.width * ParcourCanvasComponent.GRID_SIZE) * .5;
		const y = tileElement.y * ParcourCanvasComponent.GRID_SIZE - (container.clientHeight - tileElement.height * ParcourCanvasComponent.GRID_SIZE) * .5;
		this.addAnimation(new ParcourScrollAnimation(container, x, y));
	}

	private addAnimation(animation: ParcourAnimation) {
		if (animation instanceof ParcourScrollAnimation) {
			const found = this.animations.findIndex(a => a instanceof ParcourScrollAnimation);
			if (found >= 0) {
				this.animations.splice(found, 1);
			}
		}
		this.animations.push(animation);
		if (this.animation === undefined) {
			this.startAnimation();
		}
	}

	private carToPiece(car: CarInfo): Piece {
		const field = this.parcourService.getField(car.position);
		return {
			x: field.x * ParcourCanvasComponent.GRID_SIZE,
			y: field.y * ParcourCanvasComponent.GRID_SIZE,
			active: false,
			team: Team[car.team].toLowerCase()
		}
	}

	private onAnimate(timeout: number) {
		for (let i = 0; i < this.animations.length; ++i) {
			const a = this.animations[i];
			a.animate(timeout);
			if (a.isFinished) {
				this.animations.splice(i, 1);
				--i;
			}
		}
	}

	private parcourElementToTile(el: ParcourElementInfo, isFirst: boolean): Tile {
		const element = isFirst ? 'z' : (el.isCurve ? `k${el.length}` : `g${el.length}`);
		return {
			x: el.x * ParcourCanvasComponent.GRID_SIZE,
			y: el.y * ParcourCanvasComponent.GRID_SIZE,
			width: el.width * ParcourCanvasComponent.GRID_SIZE,
			height: el.height * ParcourCanvasComponent.GRID_SIZE,
			element,
			rot: `r${el.rotation}`,
			endDirection: `r${el.endDirection}`,
			speed: el.isCurve ? String(el.curveSpeed) : ''
		};
	}

	private startAnimation() {
		let time = performance.now();
		const animation = () => {
			this.animation = undefined;
			const t = performance.now();
			this.onAnimate((t - time) / 1000);
			time = t;
			if (this.animations.length > 0) {
				this.animation = requestAnimationFrame(animation);
			}
		};
		this.animation = requestAnimationFrame(animation);
	}

	private updateTiles() {
		this.tiles = this.parcourService.elements.map((e, i) => this.parcourElementToTile(e, i === 0));
	}
}
