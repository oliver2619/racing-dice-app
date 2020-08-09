import {Component, Input} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

    @Input()
    public title: string = '';

    private _visible = false;
    private _questionSubject: Subject<boolean>;

    constructor() {}

    get isQuestion(): boolean {
        return this._questionSubject !== undefined;
    }

    get visible(): boolean {
        return this._visible;
    }

    cancel(): void {
        this._visible = false;
        if (this._questionSubject !== undefined) {
            this._questionSubject.next(false);
            this._questionSubject = undefined;
        }
    }

    ok(): void {
        this._visible = false;
        if (this._questionSubject !== undefined) {
            this._questionSubject.next(true);
            this._questionSubject = undefined;
        }
    }

    question(): Observable<boolean> {
        this._visible = true;
        this._questionSubject = new Subject<boolean>();
        return this._questionSubject;
    }

    show(): void {
        this._visible = true;
        this._questionSubject = undefined;
    }

}
