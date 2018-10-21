import {Injectable} from '@angular/core';
import {CarSetup} from '../model/carSetup';
import {Team} from '../model/teams';

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
    
    constructor() {}

    getSetup(): CarSetup{
        return this.carSetup[this._team];
    }
    
    get team(): Team {
        return this._team;
    }
    
    set team(team: Team) {
        this._team = team;
    }
}
