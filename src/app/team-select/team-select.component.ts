import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Team} from '../model/teams';
import {CarSetupService} from '../car-setup/car-setup.service';
import {DialogComponent} from '../dialog/dialog.component';

@Component({
    selector: 'app-team-select',
    templateUrl: './team-select.component.html',
    styleUrls: ['./team-select.component.css']
})
export class TeamSelectComponent {

    @ViewChild(DialogComponent, {static: true})
    private dlgTeams: DialogComponent;

    @Output()
    onChange = new EventEmitter<Team>();

    constructor(private carSetupService: CarSetupService) {}

    get team(): number {
        return this.carSetupService.team;
    }

    set team(team: number) {
        this.carSetupService.team = team;
        this.onChange.emit(team);
    }

    about(): void {
        this.dlgTeams.show();
    }
}
