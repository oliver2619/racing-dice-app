import { Component } from '@angular/core';
import { AudioService } from '../audio.service';
import { AppService } from '../app.service';
import { CarSetupService } from '../car-setup/car-setup.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

	get raceDigital(): boolean {
		return this.appService.raceDigital;
	}

	get soundLevel(): number {
		return this.audioService.volumeLevel;
	}

	get driving(): boolean {
		return this.carSetupService.car.driving;
	}

	constructor(private audioService: AudioService, private appService: AppService, private carSetupService: CarSetupService) { }

	setRaceDigital(digital: boolean): void {
		this.appService.setRaceDigital(digital);
	}

	setSoundLevel(level: number): void {
		this.audioService.setVolumeLevel(level);
	}
}
