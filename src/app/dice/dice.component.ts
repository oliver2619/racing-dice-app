import { Component } from '@angular/core';
import { LocalStoreService } from 'src/app/local-store.service';

interface DiceJson {
	version: number;
	score: number;
}

@Component({
	selector: 'app-dice',
	templateUrl: './dice.component.html',
	styleUrls: ['./dice.component.css']
})
export class DiceComponent {

	private static readonly STORE_KEY = 'dice';

	private _score = 0;
	private _interval: number;

	constructor(private localStoreService: LocalStoreService) {
		const json = <DiceJson>localStoreService.load(DiceComponent.STORE_KEY);
		if (json !== undefined) {
			this._score = json.score;
		}
	}

	get score(): number {
		return this._score;
	}

	get isGettingScore(): boolean {
		return this._interval !== undefined;
	}

	get maxValue(): number {
		return 1234;
	}

	getScore(): void {
		if (this.isGettingScore)
			return;
		this._score = this.shuffle();
		const count = Math.floor(Math.random() * 10) + 1;
		let i = 0;
		this._interval = window.setInterval(() => {
			this._score = this.shuffle();
			if (++i >= count) {
				window.clearInterval(this._interval);
				this._interval = undefined;
				const json: DiceJson = {
					version: 1,
					score: this._score
				};
				this.localStoreService.save(DiceComponent.STORE_KEY, json);
			}
		}, 200);
	}

	private shuffle(): number {
		return Math.floor(Math.exp(Math.random() * Math.log(this.maxValue + 1)) - 1);
	}
}
