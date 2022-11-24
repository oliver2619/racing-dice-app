import { Component, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

	@Input()
	title: string = '';

	@Input()
	scrolling = false;

	private _visible = false;
	private _question = false;
	private _questionSubject: Subject<any> | undefined;

	constructor() { }

	get isQuestion(): boolean {
		return this._question;
	}

	get visible(): boolean {
		return this._visible;
	}

	cancel(): void {
		this._visible = false;
		if (this._questionSubject !== undefined) {
			this._questionSubject.next(undefined);
			this._questionSubject = undefined;
		}
	}

	ok<T>(value?: T): void {
		this._visible = false;
		if (this._questionSubject !== undefined) {
			this._questionSubject.next(this._question ? true : value);
			this._questionSubject = undefined;
		}
	}

	question(): Observable<boolean> {
		this._visible = true;
		this._questionSubject = new Subject<boolean>();
		this._question = true;
		return this._questionSubject;
	}

	show<T>(): Observable<T> {
		this._visible = true;
		this._questionSubject = new Subject<T>();
		this._question = false;
		return this._questionSubject;
	}
}
