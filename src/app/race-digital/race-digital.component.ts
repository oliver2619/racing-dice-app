import { Component, ViewChild } from '@angular/core';
import { CarInfo } from '../model/car-info';
import { CarSetupService } from '../car-setup/car-setup.service';
import { DialogComponent } from '../dialog/dialog.component';
import { TeamService } from '../team-select/team.service';
import { AudioService } from '../audio.service';
import { RaceService } from '../race/race.service';

@Component({
	selector: 'app-race-digital',
	templateUrl: './race-digital.component.html',
	styleUrls: ['./race-digital.component.scss']
})
export class RaceDigitalComponent {

	@ViewChild('question')
	private questionDialog: DialogComponent | undefined;

	isDriving(): boolean {
		return this.currentCar.driving;
	}

	private get currentCar(): CarInfo {
		return this.carSetupService.car;
	}

	constructor(private readonly carSetupService: CarSetupService, private readonly teamService: TeamService, private readonly audioService: AudioService, private readonly raceService: RaceService) { }

	horn(): void {
		this.audioService.horn(this.teamService.team);
	}

	isHorn(): boolean {
		return this.audioService.hornPlayed;
	}

	startQualifying() {
	}

	startRace() {
		this.raceService.startRace();
	}

	stop(): void {
		this.questionDialog?.question().subscribe({
			next: result => {
				if (result) {
					this.carSetupService.stop();
					this.raceService.stop();
				}
			}
		});
	}
}
