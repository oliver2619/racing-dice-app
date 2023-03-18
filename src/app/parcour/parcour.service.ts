import { Injectable } from '@angular/core';
import { Parcour } from '../model/parcour';
import { LocalStoreService } from '../local-store.service';
import { ParcourJson } from '../model/parcour-json';
import { CurveLength, CurveTurn, Lane, ParcourElementRotation, StraightLength } from '../model/parcour-types';
import { ParcourInfo } from '../model/parcour-info';
import { ParcourElementInfo } from '../model/parcour-element-info';
import { FieldInfo } from '../model/field-info';
import { CarPositionInfo } from '../model/car-position-info';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ParcourService {

	readonly onChangeStructure = new Subject<void>();

	private static readonly STORE_KEY: string = 'parcour';

	private readonly _parcour = new Parcour();

	get elements(): ParcourElementInfo[] {
		return this._parcour.elements;
	}

	get fields(): number {
		return this._parcour.fields;
	}

	get isComplete(): boolean {
		return this._parcour.isComplete;
	}

	get isEmpty(): boolean {
		return this._parcour.isEmpty;
	}

	get numberOfElements(): number {
		return this._parcour.numberOfElements;
	}

	get parcour(): ParcourInfo {
		return this._parcour;
	}

	get rounds(): number {
		return this._parcour.rounds;
	}

	set rounds(rounds: number) {
		this._parcour.rounds = rounds;
		this.save();
	}

	get startElementRotation(): ParcourElementRotation {
		return this._parcour.startElementRotation;
	}

	constructor(private readonly localStoreService: LocalStoreService) {
		const json: ParcourJson = <ParcourJson>this.localStoreService.load(ParcourService.STORE_KEY);
		if (json !== undefined) {
			this._parcour.load(json);
		}
	}

	appendStraight(afterIndex: number, length: 3 | 4): void {
		this._parcour.appendStraight(afterIndex, length);
		this.save();
		this.onChangeStructure.next();
	}

	appendCurve(afterIndex: number, length: 1 | 3 | 4, speed: number, turn: CurveTurn): void {
		this._parcour.appendCurve(afterIndex, length, speed, turn);
		this.save();
		this.onChangeStructure.next();
	}

	clear(): void {
		this._parcour.clear();
		this.save();
		this.onChangeStructure.next();
	}

	getField(position: CarPositionInfo): FieldInfo {
		return this._parcour.getField(position);
	}

	remove(i: number): void {
		this._parcour.remove(i);
		this.save();
		this.onChangeStructure.next();
	}

	rotateStartElement(rotation: ParcourElementRotation) {
		this._parcour.rotateStartElement(rotation);
		this.save();
		this.onChangeStructure.next();
	}

	setCurveSpeed(curve: number, speed: number) {
		const el = this._parcour.elements[curve];
		if (el.isCurve) {
			this._parcour.setCurveSpeed(curve, speed);
			this.save();
			this.onChangeStructure.next();
		}
	}

	setElementLength(element: number, length: CurveLength | StraightLength) {
		const el = this._parcour.elements[element];
		if (el.isCurve && el.length !== length) {
			let speed = 0;
			if (length === 1) {
				speed = 11;
			} else if (length === 4) {
				speed = 19;
			} else {
				speed = 15;
			}
			this._parcour.setCurveSpeed(element, speed);
		}
		this._parcour.setElementLength(element, length);
		this.save();
		this.onChangeStructure.next();
	}

	private save(): void {
		const json = this._parcour.save();
		this.localStoreService.save(ParcourService.STORE_KEY, json);
	}
}
