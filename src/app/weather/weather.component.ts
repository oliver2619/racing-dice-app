import { Component } from '@angular/core';
import {RaceService} from '../race/race.service';
import {Weather} from '../model/race';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {

    private _weatherShuffleInterval: number;
    private _weatherShuffleTimeout: number;

  constructor(private raceService: RaceService) { }

    get weather(): Weather {
        return this.raceService.weather;
    }

    set weather(weather: Weather) {
        this.raceService.weather = weather;
    }

    isShufflingWeather(): boolean {
        return this._weatherShuffleTimeout !== undefined;
    }

    shuffleWeather(): void {
        if (this.isShufflingWeather())
            return;
        this._weatherShuffleInterval = window.setInterval(() => {
            this.raceService.shuffleWeather();
        }, 50);
        this._weatherShuffleTimeout = window.setTimeout(() => {
            window.clearInterval(this._weatherShuffleInterval);
            this._weatherShuffleInterval = undefined;
            this._weatherShuffleTimeout = undefined;
        }, 1000);

    }

}
