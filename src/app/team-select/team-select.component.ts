import { Component, ViewChild } from '@angular/core';
import { AppService, GameMode } from '../app.service';
import { DialogComponent } from '../dialog/dialog.component';
import { TeamService } from './team.service';

@Component({
	selector: 'app-team-select',
	templateUrl: './team-select.component.html',
	styleUrls: ['./team-select.component.scss']
})
export class TeamSelectComponent {

	@ViewChild(DialogComponent)
	private dlgTeams: DialogComponent | undefined;

	constructor(private readonly teamService: TeamService, private readonly appService: AppService) { }

	get mode(): GameMode {
		return this.appService.mode;
	}

	set mode(m: GameMode) {
		this.appService.setMode(m);
	}

	get team(): number {
		return this.teamService.team;
	}

	set team(team: number) {
		this.teamService.team = team;
	}

	about(): void {
		this.dlgTeams?.show();
	}
}
