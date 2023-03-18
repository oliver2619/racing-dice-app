import { Component } from '@angular/core';
import { AppService, GameMode } from '../app.service';
import { ParcourService } from '../parcour/parcour.service';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

	get canRace(): boolean { return this.parcourService.isComplete; }

	get fullscreen(): boolean { return this.appService.fullscreen; }

	get isSingleRaceMode(): boolean { return this.appService.mode === GameMode.SINGLE_RACE; }

	constructor(private readonly appService: AppService, private readonly parcourService: ParcourService) { }

	toggleFullscreen(): void {
		this.appService.toggleFullscreen();
	}
}
