import {Injectable} from '@angular/core';
import {CarSetup} from '../model/carSetup';
import {Team} from '../model/teams';

export type TeamSelectionChangeObserver = (team: Team) => any;

@Injectable()
export class CarSetupService {

    private carSetup: Array<CarSetup> = [
        new CarSetup(Team.YELLOW),
        new CarSetup(Team.RED),
        new CarSetup(Team.GREEN),
        new CarSetup(Team.BLUE),
        new CarSetup(Team.VIOLET),
        new CarSetup(Team.BLACK)
    ];

    private _team: Team = Team.YELLOW;
    private _observers: TeamSelectionChangeObserver[] = [];

    getSetup(): CarSetup {
        return this.carSetup[this._team];
    }

    get team(): Team {
        return this._team;
    }

    set team(team: Team) {
        if (this._team !== team) {
            this._team = team;
            this._observers.forEach(o => o(this._team));
        }
    }

    addTeamSelectionEvent(callback: TeamSelectionChangeObserver): void {
        this._observers.push(callback);
    }

    removeTeamSelectionEvent(callback: TeamSelectionChangeObserver): void {
        this._observers = this._observers.filter(o => o !== callback);
    }
}
