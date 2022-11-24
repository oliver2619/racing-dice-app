import { Component, ViewChild } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { Observable } from 'rxjs';
import { ParcourElement } from '../model/parcour';

@Component({
	selector: 'app-edit-parcour-element',
	templateUrl: './edit-parcour-element.component.html',
	styleUrls: ['./edit-parcour-element.component.scss']
})
export class EditParcourElementComponent {

	@ViewChild('dialog')
	private dialog: DialogComponent | undefined;

	curveLength: number | undefined;

	get curves(): number[] {
		const ret: number[] = [];
		for (let i = 10; i <= 20; ++i) {
			ret.push(i);
		}
		return ret;
	}

	constructor() { }

	show(element?: ParcourElement): Observable<ParcourElement> {
		if (element !== undefined) {
			this.curveLength = element.isCurve ? element.length : undefined;
		} else {
			this.curveLength = undefined;
		}
		if (this.dialog === undefined) {
			throw new Error('Dialog container not found');
		}
		return this.dialog.show();
	}

	selectCurve(curve: number): void {
		if (this.dialog !== undefined) {
			this.dialog.ok(new ParcourElement(this.curveLength!, 0, 0, 0, curve));
		}
	}

	setStraight(length: number): void {
		if (this.dialog !== undefined) {
			this.dialog.ok(new ParcourElement(length, 0, 0, 0));
		}
	}

	setCurve(length: number): void {
		this.curveLength = length;
	}
}
