import {Injectable} from '@angular/core';
import {CarSetup, CarSetupObserver, CarSetupJson} from '../model/carSetup';
import {Team} from '../model/teams';
import {LocalStoreService} from 'src/app/local-store.service';

export type TeamSelectionChangeObserver = (team: Team) => any;

interface CarListAndTeamSetupJson {
    version: number;
    team: string;
    yellow: CarSetupJson;
    red: CarSetupJson;
    green: CarSetupJson;
    blue: CarSetupJson;
    violet: CarSetupJson;
    black: CarSetupJson;
}

@Injectable()
export class CarSetupService {

    private static readonly STORE_KEY: string = 'carSetup';

    private _carSetupObserver: CarSetupObserver = setup => this.save();

    private carSetup: CarSetup[] = [
        new CarSetup(Team.YELLOW, this._carSetupObserver),
        new CarSetup(Team.RED, this._carSetupObserver),
        new CarSetup(Team.GREEN, this._carSetupObserver),
        new CarSetup(Team.BLUE, this._carSetupObserver),
        new CarSetup(Team.VIOLET, this._carSetupObserver),
        new CarSetup(Team.BLACK, this._carSetupObserver)
    ];

    private _team: Team;
    private _observers: TeamSelectionChangeObserver[] = [];

    constructor(private localStoreService: LocalStoreService) {
        const json = <CarListAndTeamSetupJson> this.localStoreService.load(CarSetupService.STORE_KEY);
        if (json === undefined) {
            this._team = Team.YELLOW;
        } else {
            this._team = Team[json.team.toUpperCase()];
            this.carSetup[Team.YELLOW].load(json.yellow);
            this.carSetup[Team.RED].load(json.red);
            this.carSetup[Team.GREEN].load(json.green);
            this.carSetup[Team.BLUE].load(json.blue);
            this.carSetup[Team.VIOLET].load(json.violet);
            this.carSetup[Team.BLACK].load(json.black);
        }
    }

    getSetup(): CarSetup {
        return this.carSetup[this._team];
    }

    get team(): Team {
        return this._team;
    }

    set team(team: Team) {
        if (this._team !== team) {
            this._team = team;
            this.save();
            this._observers.forEach(o => o(this._team));
        }
    }

    addTeamSelectionEvent(callback: TeamSelectionChangeObserver): void {
        this._observers.push(callback);
    }

    removeTeamSelectionEvent(callback: TeamSelectionChangeObserver): void {
        this._observers = this._observers.filter(o => o !== callback);
    }

    private save(): void {
        const json: CarListAndTeamSetupJson = {
            version: 1,
            team: Team[this._team].toLowerCase(),
            yellow: this.carSetup[Team.YELLOW].save(),
            red: this.carSetup[Team.RED].save(),
            green: this.carSetup[Team.GREEN].save(),
            blue: this.carSetup[Team.BLUE].save(),
            violet: this.carSetup[Team.VIOLET].save(),
            black: this.carSetup[Team.BLACK].save(),
        };
        this.localStoreService.save(CarSetupService.STORE_KEY, json);
    }
}
