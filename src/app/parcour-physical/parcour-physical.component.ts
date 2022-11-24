import { Component, ViewChild } from '@angular/core';
import { ParcourElement } from '../model/parcour';
import { ParcourService } from '../parcour/parcour.service';
import { CarSetupService } from '../car-setup/car-setup.service';
import { DialogComponent } from '../dialog/dialog.component';
import { EditParcourElementComponent } from '../edit-parcour-element/edit-parcour-element.component';

interface ParcourComponentElement {
	element: ParcourElement;
	index: number;
}

@Component({
	selector: 'app-parcour-physical',
	templateUrl: './parcour-physical.component.html',
	styleUrls: ['./parcour-physical.component.scss']
})
export class ParcourPhysicalComponent {

	private static readonly BLOCK_SIZE = 6;

	scrollPos = 0;

	@ViewChild('question')
	private questionDialog: DialogComponent | undefined;

	@ViewChild('curve')
	private curveDialog: DialogComponent | undefined;

	@ViewChild('editElement')
	private editElementDialog: EditParcourElementComponent | undefined;

	@ViewChild('elementOptions')
	private elementOptionsDialog: DialogComponent | undefined;

	private _selectionIndex: number | undefined;

	get rounds(): number {
		return this.parcourService.rounds;
	}

	get canDecRounds(): boolean {
		return this.rounds > 1;
	}

	get canIncRounds(): boolean {
		return this.rounds < 20;
	}

	get canClear(): boolean {
		return !this.parcourService.isEmpty;
	}

	get parcourElements(): ParcourComponentElement[] {
		return this.parcourService.elements.slice(this.scrollPos, this.scrollPos + ParcourPhysicalComponent.BLOCK_SIZE).map((el, i) => {
			const ret: ParcourComponentElement = {
				element: el,
				index: i + this.scrollPos
			};
			return ret;
		});
	}

	get curves(): number[] {
		const ret: number[] = [];
		for (let i = 10; i <= 20; ++i) {
			ret.push(i);
		}
		return ret;
	}

	get parcourLength(): number {
		return this.parcourService.length;
	}

	get driving(): boolean {
		return this.carSetupService.car.driving;
	}

	constructor(private readonly parcourService: ParcourService, private carSetupService: CarSetupService) { }

	canScroll(amount: number): boolean {
		const n = this.scrollPos + amount;
		return n >= 0 && n <= this.parcourService.length - ParcourPhysicalComponent.BLOCK_SIZE;
	}

	scroll(amount: number): void {
		this.scrollPos += amount;
	}

	insertStraight(length: number): void {
		this.parcourService.appendStraight(length);
		this.scrollToEnd();
	}

	insertCurve(length: number): void {
		this.curveDialog?.show<number>().subscribe({
			next: (curve: number) => {
				this.parcourService.appendCurve(length, curve);
				this.scrollToEnd();
			}
		});
	}

	clear(): void {
		this.questionDialog?.question().subscribe({
			next: result => {
				if (result) {
					this.parcourService.clear();
					this.scrollPos = 0;
				}
			}
		});
	}

	editElementByIndex(index: number): void {
		if (index === 0) {
			return;
		}
		this._selectionIndex = index;
		this.elementOptionsDialog?.show();
	}

	selectCurveSpeed(speed: number): void {
		this.curveDialog?.ok(speed);
	}

	decRounds(): void {
		--this.parcourService.rounds;
	}

	incRounds(): void {
		++this.parcourService.rounds;
	}

	editSelected(): void {
		if (this.elementOptionsDialog !== undefined && this._selectionIndex !== undefined) {
			this.elementOptionsDialog.cancel();
			const el = this.parcourService.elements[this._selectionIndex];
			this.editElementDialog?.show(el).subscribe({
				next: value => {
					if (value !== undefined) {
						this.parcourService.replace(this._selectionIndex!, value);
					}
				}
			});
		}
	}

	insertBeforeSelection(): void {
		if (this.elementOptionsDialog !== undefined && this._selectionIndex !== undefined) {
			this.elementOptionsDialog.cancel();
			const el = this.parcourService.elements[this._selectionIndex];
			this.editElementDialog?.show().subscribe({
				next: value => {
					if (value !== undefined) {
						this.parcourService.insert(this._selectionIndex!, value);
					}
				}
			});
		}
	}

	deleteSelected(): void {
		this.elementOptionsDialog?.cancel();
		if(this._selectionIndex !== undefined) {
			this.parcourService.remove(this._selectionIndex);
		}
	}

	private scrollToEnd(): void {
		this.scrollPos = Math.max(0, this.parcourService.length - ParcourPhysicalComponent.BLOCK_SIZE);
	}
}
