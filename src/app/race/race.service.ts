import { Injectable } from '@angular/core';
import { Race, Weather } from '../model/race';
import { LocalStoreService } from 'src/app/local-store.service';
import { CarInfo } from '../model/car-info';
import { ParcourService } from '../parcour/parcour.service';

interface RaceJson {
	version: number;
	weather: string;
}

@Injectable({
	providedIn: 'root'
})
export class RaceService {

	private static readonly STORE_KEY = 'race';

	private readonly _race: Race = new Race();

	get cars(): CarInfo[] {
		return this._race.cars;
	}

	get weather(): Weather {
		return this._race.weather;
	}

	set weather(weather: Weather) {
		this._race.weather = weather;
		const json: RaceJson = {
			version: 1,
			weather: Weather[this._race.weather]
		};
		this.localStoreService.save(RaceService.STORE_KEY, json);
	}

	constructor(private localStoreService: LocalStoreService, parcourService: ParcourService) {
		this._race.parcour = parcourService.parcour;
		const data = <RaceJson>localStoreService.load(RaceService.STORE_KEY);
		if (data !== undefined) {
			this._race.weather = (Weather as any)[data.weather];
		} else {
			this.shuffleWeather(false);
		}
	}

	startRace() {
		this._race.start();
	}

	stop() {
		this._race.stop();
	}

	shuffleWeather(isDriving: boolean): void {
		if (isDriving) {
			const w = this.weather;
			this.weather = Math.min(w + 1, Math.max(w - 1, Math.floor(Math.random() * 5)));
		} else {
			this.weather = Math.floor(Math.random() * 5);
		}
	}
}
