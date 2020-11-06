import { Component, ViewChild } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { ParcourService } from './parcour.service';
import { ParcourElement } from '../model/parcour';
import { EditParcourElementComponent } from '../edit-parcour-element/edit-parcour-element.component';

interface ParcourComponentElement {
	element: ParcourElement;
	index: number;
}

@Component({
	selector: 'app-parcour',
	templateUrl: './parcour.component.html',
	styleUrls: ['./parcour.component.scss']
})
export class ParcourComponent {

	private static readonly BLOCK_SIZE = 6;

	scrollPos = 0;

	@ViewChild('question', { static: true })
	private questionDialog: DialogComponent;

	@ViewChild('curve', { static: true })
	private curveDialog: DialogComponent;

	@ViewChild('editElement', { static: true })
	private editElementDialog: EditParcourElementComponent;

	@ViewChild('elementOptions', { static: true })
	private elementOptionsDialog: DialogComponent;

	private _selectionIndex: number;

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
		return this.parcourService.elements.slice(this.scrollPos, this.scrollPos + ParcourComponent.BLOCK_SIZE).map((el, i) => {
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

	constructor(private readonly parcourService: ParcourService) { }

	canScroll(amount: number): boolean {
		const n = this.scrollPos + amount;
		return n >= 0 && n <= this.parcourService.length - ParcourComponent.BLOCK_SIZE;
	}

	scroll(amount: number): void {
		this.scrollPos += amount;
	}

	insertStraight(length: number): void {
		this.parcourService.appendStraight(length);
		this.scrollToEnd();
	}

	insertCurve(length: number): void {
		this.curveDialog.show().subscribe({
			next: (curve: number) => {
				this.parcourService.appendCurve(length, curve);
				this.scrollToEnd();
			}
		});
	}

	clear(): void {
		this.questionDialog.question().subscribe({
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
		this.elementOptionsDialog.show();
	}

	selectCurveSpeed(speed: number): void {
		this.curveDialog.ok(speed);
	}

	decRounds(): void {
		--this.parcourService.rounds;
	}

	incRounds(): void {
		++this.parcourService.rounds;
	}

	editSelected(): void {
		this.elementOptionsDialog.cancel();
		const el = this.parcourService.elements[this._selectionIndex];
		this.editElementDialog.show(el).subscribe({
			next: value => {
				if (value !== undefined) {
					this.parcourService.replace(this._selectionIndex, value);
				}
			}
		});
	}

	insertBeforeSelection(): void {
		this.elementOptionsDialog.cancel();
		const el = this.parcourService.elements[this._selectionIndex];
		this.editElementDialog.show().subscribe({
			next: value => {
				if (value !== undefined) {
					this.parcourService.insert(this._selectionIndex, value);
				}
			}
		});
	}

	deleteSelected(): void {
		this.elementOptionsDialog.cancel();
		this.parcourService.remove(this._selectionIndex);
	}
	
	private scrollToEnd(): void {
		this.scrollPos = Math.max(0, this.parcourService.length - ParcourComponent.BLOCK_SIZE);
	}
}
