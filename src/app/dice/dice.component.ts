import {Component} from '@angular/core';

@Component({
    selector: 'app-dice',
    templateUrl: './dice.component.html',
    styleUrls: ['./dice.component.css']
})
export class DiceComponent {

    private _score: number;
    private _timeout: number;

    get score(): number {
        return this._score;
    }

    get isGettingScore(): boolean {
        return this._timeout !== undefined;
    }

    getScore(): void {
        if (this.isGettingScore)
            return;
        this._score = undefined;
        this._timeout = window.setTimeout(() => {
            this._score = Math.floor(Math.exp(Math.random() * Math.log(1235)) - 1);
            this._timeout = undefined;
        }, 1200);
    }
}
