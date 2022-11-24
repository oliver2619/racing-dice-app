import { Component, ViewChild } from '@angular/core';
import { CarInfo } from '../model/car-info';
import { CarSetupService } from '../car-setup/car-setup.service';
import { DialogComponent } from '../dialog/dialog.component';
import { TeamService } from '../team-select/team.service';
import { AudioService } from '../audio.service';

@Component({
	selector: 'app-race-digital',
	templateUrl: './race-digital.component.html',
	styleUrls: ['./race-digital.component.scss']
})
export class RaceDigitalComponent {

	@ViewChild('question', { static: true })
	private questionDialog: DialogComponent;

	isDriving(): boolean {
		return this.currentCar.driving;
	}

	private get currentCar(): CarInfo {
		return this.carSetupService.car;
	}

	constructor(private carSetupService: CarSetupService, private teamService: TeamService, private audioService: AudioService) { }

	horn(): void {
		this.audioService.horn(this.teamService.team);
	}

	isHorn(): boolean {
		return this.audioService.hornPlayed;
	}

	stop(): void {
		this.questionDialog.question().subscribe({
			next: result => {
				if (result) {
					this.carSetupService.stop();
				}
			}
		});
	}
}
