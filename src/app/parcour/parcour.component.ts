import { Component } from '@angular/core';
import { CarSetupService } from '../car-setup/car-setup.service';
import { ParcourElementInfo } from '../model/parcour-element-info';
import { CurveLength, StraightLength } from '../model/parcour-types';
import { ParcourService } from './parcour.service';
@Component({
	selector: 'app-parcour',
	templateUrl: './parcour.component.html',
	styleUrls: ['./parcour.component.scss']
})
export class ParcourComponent {

	private selectionIndex: number | undefined;

	get canClear(): boolean {
		return !this.parcourService.isEmpty;
	}

	get canDecRounds(): boolean {
		return this.rounds > 1;
	}

	get canIncRounds(): boolean {
		return this.rounds < 20;
	}

	get curve(): number | undefined {
		return this.selectedTile !== undefined ? this.selectedTile.curveSpeed : undefined;
	}

	get curveValues(): number[] {
		if (this.selectedTile !== undefined && this.selectedTile.isCurve) {
			if(this.selectedTile.length === 1) {
				return [10, 11, 12];
			}else if(this.selectedTile.length === 4) {
				return [18, 19, 20];
			}else {
				return [14, 15, 16];
			}
		} else {
			return [];
		}
	}

	get driving(): boolean {
		return this.carSetupService.car.driving;
	}

	get fields(): number {
		return this.parcourService.fields;
	}

	get hasCurveSelection(): boolean {
		return this.selectedTile !== undefined && this.selectedTile.isCurve;
	}

	get hasSelection(): boolean {
		return this.selectedTile !== undefined;
	}

	get isComplete(): boolean {
		return this.parcourService.isComplete;
	}

	get length(): number | undefined {
		return this.selectedTile !== undefined ? this.selectedTile.length : undefined;
	}

	get lengthValues(): number[] {
		if (this.selectedTile === undefined) {
			return [];
		} else {
			return this.selectedTile.isCurve ? [1, 3, 4] : [3, 4];
		}
	}

	get rounds(): number {
		return this.parcourService.rounds;
	}

	private get selectedTile(): ParcourElementInfo | undefined {
		return this.selectionIndex === undefined ? undefined : this.parcourService.elements[this.selectionIndex];
	}

	constructor(private readonly parcourService: ParcourService, private carSetupService: CarSetupService) { }

	clear(): void {
		this.selectionIndex = undefined;
		this.parcourService.clear();
	}

	decRounds(): void {
		--this.parcourService.rounds;
	}

	incRounds(): void {
		++this.parcourService.rounds;
	}

	onSelectTile(i: number | undefined) {
		this.selectionIndex = i;
	}

	setCurve(c: number) {
		this.parcourService.setCurveSpeed(this.selectionIndex!, c);
	}

	setLength(l: number) {
		this.parcourService.setElementLength(this.selectionIndex!, l as (CurveLength | StraightLength));
	}
}
