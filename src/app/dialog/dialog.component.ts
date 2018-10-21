import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    @Input()
    public title: string = '';
    
    private _visible = false;

    constructor() {}

    ngOnInit() {
    }

    get visible(): boolean {
        return this._visible;
    }
    
    close(): void {
        this._visible = false;
    }
    
    show(): void {
        this._visible = true;
    }
}
