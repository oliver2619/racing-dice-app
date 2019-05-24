import {Component} from '@angular/core';

@Component({
    selector: 'app-dice',
    templateUrl: './dice.component.html',
    styleUrls: ['./dice.component.css']
})
export class DiceComponent {

    private _score: number;
    private _timeout: number;
    private _interval: number;

    get score(): number {
        return this._score;
    }

    get isGettingScore(): boolean {
        return this._timeout !== undefined;
    }

    get hasScore(): boolean {
        return this._score !== undefined;
    }
    
    getScore(): void {
        if (this.isGettingScore)
            return;
        this._interval = window.setInterval(() => {
            this._score = this.shuffle();
        }, 50);
        this._timeout = window.setTimeout(() => {
            this._score = this.shuffle();
            this._timeout = undefined;
            window.clearInterval(this._interval);
            this._interval = undefined;
        }, 1200);
    }
    
    private shuffle(): number {
        return Math.floor(Math.exp(Math.random() * Math.log(1235)) - 1);
    }
}
