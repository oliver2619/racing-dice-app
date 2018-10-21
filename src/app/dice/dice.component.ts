import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-dice',
    templateUrl: './dice.component.html',
    styleUrls: ['./dice.component.css']
})
export class DiceComponent implements OnInit {

    private _startScore: number;
    private _timeout: number;

    constructor() {}

    ngOnInit() {
    }

    get startScore(): number {
        return this._startScore;
    }

    isGettingStartScore(): boolean {
        return this._timeout !== undefined;
    }
    
    getStartScore(): void {
        if (this.isGettingStartScore())
            return;
        this._startScore = undefined;
        this._timeout = window.setTimeout(()=>{
            this._startScore = Math.floor(Math.exp(Math.random() * Math.log(1001)) - 1);
            this._timeout = undefined;
        }, 1000);
    }
}
