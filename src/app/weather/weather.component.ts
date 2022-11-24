import { Component } from '@angular/core';
import { RaceService } from '../race/race.service';
import { Weather } from '../model/race';
import { CarSetupService } from '../car-setup/car-setup.service';

@Component({
	selector: 'app-weather',
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {

	private _weatherShuffleInterval: number | undefined;
	private _weatherShuffleTimeout: number | undefined;

	get weather(): Weather {
		return this.raceService.weather;
	}

	set weather(weather: Weather) {
		this.raceService.weather = weather;
	}

	private get driving(): boolean {
		return this.carSetupService.car.driving;
	}

	constructor(private raceService: RaceService, private carSetupService: CarSetupService) { }

	canSetWeather(weather: Weather): boolean {
		if (this.driving) {
			return Math.abs(weather - this.raceService.weather) < 2;
		} else {
			return true;
		}
	}

	isShufflingWeather(): boolean {
		return this._weatherShuffleTimeout !== undefined;
	}

	shuffleWeather(): void {
		if (this.isShufflingWeather())
			return;
		const weather = this.raceService.weather;
		this._weatherShuffleInterval = window.setInterval(() => {
			if (this.driving) {
				this.raceService.weather = weather;
			}
			this.raceService.shuffleWeather(this.driving);
		}, 50);
		this._weatherShuffleTimeout = window.setTimeout(() => {
			window.clearInterval(this._weatherShuffleInterval);
			this._weatherShuffleInterval = undefined;
			this._weatherShuffleTimeout = undefined;
		}, 1000);

	}

}
