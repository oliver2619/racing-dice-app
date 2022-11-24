import { Component, ViewChild } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { TeamService } from './team.service';

@Component({
	selector: 'app-team-select',
	templateUrl: './team-select.component.html',
	styleUrls: ['./team-select.component.css']
})
export class TeamSelectComponent {

	@ViewChild(DialogComponent)
	private dlgTeams: DialogComponent | undefined;

	constructor(private readonly teamService: TeamService) { }

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
