import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Team} from '../model/teams';
import {CarSetupService} from '../car-setup/car-setup.service';

@Component({
    selector: 'app-team-select',
    templateUrl: './team-select.component.html',
    styleUrls: ['./team-select.component.css']
})
export class TeamSelectComponent implements OnInit {

    @Output()
    onChange = new EventEmitter<Team>();

    constructor(private carSetupService: CarSetupService) {}

    ngOnInit() {
    }

    get team(): number {
        return this.carSetupService.team;
    }

    set team(team: number) {
        this.carSetupService.team = team;
        this.onChange.emit(team);
    }
}
