import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
	selector: 'app-race',
	templateUrl: './race.component.html',
	styleUrls: ['./race.component.scss']
})
export class RaceComponent {

	get raceDigital(): boolean {
		return this.appService.raceDigital
	}

	constructor(private appService: AppService) {
	}
}
