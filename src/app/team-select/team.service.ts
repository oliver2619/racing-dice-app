import { Injectable } from '@angular/core';
import { Team } from '../model/teams';
import { LocalStoreService } from '../local-store.service';

export type TeamSelectionChangeObserver = (team: Team) => any;

interface TeamJson {
	version: 1;
	team: number;
}

@Injectable({
	providedIn: 'root'
})
export class TeamService {

	private static readonly STORE_KEY = 'team';

	private _team: Team;
	private _observers: TeamSelectionChangeObserver[] = [];

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

	constructor(private localStoreService: LocalStoreService) {
		const json: TeamJson = <TeamJson>this.localStoreService.load(TeamService.STORE_KEY);
		if (json !== undefined) {
			this._team = json.team;
		} else {
			this._team = Team.YELLOW;
		}
		this._observers.forEach(o => o(this._team));
	}

	addTeamSelectionEvent(callback: TeamSelectionChangeObserver): void {
		this._observers.push(callback);
	}

	removeTeamSelectionEvent(callback: TeamSelectionChangeObserver): void {
		this._observers = this._observers.filter(o => o !== callback);
	}

	private save(): void {
		const json: TeamJson = {
			version: 1,
			team: this._team
		};
		this.localStoreService.save(TeamService.STORE_KEY, json);
	}
}
