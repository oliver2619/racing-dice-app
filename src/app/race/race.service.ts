import { Injectable } from '@angular/core';
import { Race, Weather } from '../model/race';
import { LocalStoreService } from 'src/app/local-store.service';
import { CarSetupService } from '../car-setup/car-setup.service';

interface RaceJson {
	version: number;
	weather: string;
}

@Injectable()
export class RaceService {

	private static readonly STORE_KEY = 'race';

	private _weather: Weather;

	private _race: Race = new Race();

	getRace(): Race {
		return this._race;
	}

	get weather(): Weather {
		return this._weather;
	}

	set weather(weather: Weather) {
		this._weather = weather;
		const json: RaceJson = {
			version: 1,
			weather: Weather[this._weather]
		};
		this.localStoreService.save(RaceService.STORE_KEY, json);
	}

	constructor(private localStoreService: LocalStoreService) {
		const data = <RaceJson>localStoreService.load(RaceService.STORE_KEY);
		if (data !== undefined) {
			this._weather = Weather[data.weather];
		} else {
			this.shuffleWeather(false);
		}
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
