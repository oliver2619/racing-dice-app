import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppService } from './app.service';
import { Team } from 'src/app/model/teams';
import { TeamService } from './team-select/team.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

	@ViewChild('app')
	element: ElementRef | undefined;

	get team(): string { return Team[this.teamService.team].toLowerCase(); }

	constructor(private appService: AppService, private readonly teamService: TeamService) { }

	ngOnInit(): void {
		document.addEventListener("contextmenu", (ev: MouseEvent) => {
			ev.preventDefault();
		});
		document.addEventListener("selectstart", (ev: Event) => {
			ev.preventDefault();
		});
	}

	ngAfterViewInit(): void {
		if (this.element !== undefined) {
			this.appService.registerFullScreenElement(this.element.nativeElement);
		}
	}
}
