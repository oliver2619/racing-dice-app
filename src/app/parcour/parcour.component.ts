import { Component} from '@angular/core';
import { AppService } from '../app.service';

@Component({
	selector: 'app-parcour',
	templateUrl: './parcour.component.html',
	styleUrls: ['./parcour.component.scss']
})
export class ParcourComponent {

	get raceDigital(): boolean {
		return this.appService.raceDigital
	}

	constructor(private appService: AppService) {
	}
}
