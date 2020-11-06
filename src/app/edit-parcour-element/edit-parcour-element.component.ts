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

	@ViewChild('dialog', { static: true })
	private dialog: DialogComponent;
	
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
		if(element !== undefined) {
			this.curveLength = element.isCurve ? element.length : undefined;
		}else {
			this.curveLength = undefined;
		}
		return this.dialog.show();
	}
	
	selectCurve(curve: number): void {
		this.dialog.ok(new ParcourElement(this.curveLength, curve));
	}
	
	setStraight(length: number): void {
		this.dialog.ok(new ParcourElement(length));
	}
	
	setCurve(length: number): void {
		this.curveLength = length;
	}
}
