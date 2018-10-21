import {Injectable} from '@angular/core';
import {Race, Weather} from '../model/race';

@Injectable()
export class RaceService {

    private _weather: Weather = Weather.CLOUDY;

    private _race: Race = new Race();
    
    constructor() {}

    getRace(): Race {
        return this._race;
    }
    
    get weather(): Weather {
        return this._weather;
    }

    set weather(weather: Weather) {
        this._weather = weather;
    }
    
    shuffleWeather(): void {
        this.weather = Math.floor(Math.random() * 5);
    }
}
