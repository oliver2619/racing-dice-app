import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

	constructor(private appService: AppService) { }

	get fullscreen(): boolean { return this.appService.fullscreen; }

	toggleFullscreen(): void {
		this.appService.toggleFullscreen();
	}
}
