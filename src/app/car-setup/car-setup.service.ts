import { Injectable } from '@angular/core';
import { CarSetup } from '../model/carSetup';
import { Team } from '../model/teams';
import { LocalStoreService } from 'src/app/local-store.service';
import { Car } from '../model/car';
import { TeamService } from '../team-select/team.service';
import { RaceService } from '../race/race.service';
import { CarInfo } from '../model/car-info';
import { CarJson } from '../model/car-json';
import { Benchmark } from '../model/benchmark';
import { ParcourInfo } from '../model/parcour-info';

interface CarListAndTeamSetupJson {
	version: number;
	yellow: CarJson;
	red: CarJson;
	green: CarJson;
	blue: CarJson;
	violet: CarJson;
	black: CarJson;
}

@Injectable({
	providedIn: 'root'
})
export class CarSetupService {

	private static readonly STORE_KEY: string = 'carSetup';

	private _car: Car[] = [
		new Car(new CarSetup(Team.YELLOW)),
		new Car(new CarSetup(Team.RED)),
		new Car(new CarSetup(Team.GREEN)),
		new Car(new CarSetup(Team.BLUE)),
		new Car(new CarSetup(Team.VIOLET)),
		new Car(new CarSetup(Team.BLACK))
	];

	get car(): CarInfo {
		return this._car[this.teamService.team];
	}

	constructor(private localStoreService: LocalStoreService, private readonly teamService: TeamService, private readonly raceService: RaceService) {
		const json = <CarListAndTeamSetupJson>this.localStoreService.load(CarSetupService.STORE_KEY);
		if (json !== undefined) {
			this._car[Team.YELLOW].load(json.yellow);
			this._car[Team.RED].load(json.red);
			this._car[Team.GREEN].load(json.green);
			this._car[Team.BLUE].load(json.blue);
			this._car[Team.VIOLET].load(json.violet);
			this._car[Team.BLACK].load(json.black);
		}
	}

	armBrakeJoker(): void {
		this._car[this.teamService.team].armBrakeJoker();
		this.save();
	}

	armCurvesJoker(): void {
		this._car[this.teamService.team].armCurveJoker();
		this.save();
	}

	armSpeedJoker(): void {
		this._car[this.teamService.team].armSpeedJoker();
		this.save();
	}

	benchmark(parcour: ParcourInfo): number {
		const car = this._car[this.teamService.team].clone();
		const b = new Benchmark(car, parcour, this.raceService.weather);
		return b.run();
	}

	changeFuel(amount: number): void {
		this._car[this.teamService.team].fuel += amount;
		this.save();
	}

	giveUp(): void {
		this._car[this.teamService.team].giveUp();
		this.save();
	}

	drive(speed: number): void {
		this._car[this.teamService.team].drive(speed, this.raceService.weather);
		this.save();
	}

	repair(): void {
		this._car[this.teamService.team].repair();
		this.save();
	}

	setCurve(curve: number | undefined): void {
		this._car[this.teamService.team].curve = curve;
		this.save();
	}

	setDurability(durability: number): void {
		this._car[this.teamService.team].setup.durability = durability;
		this.save();
	}

	setFlaps(flaps: number): void {
		this._car[this.teamService.team].setup.flaps = flaps;
		this.save();
	}

	setGear(gear: number): void {
		this._car[this.teamService.team].setup.gear = gear;
		this.save();
	}

	setTires(tires: number): void {
		this._car[this.teamService.team].setup.tires = tires;
		this.save();
	}

	stop(): void {
		this._car[this.teamService.team].stop();
		this.save();
	}

	throwDice(): void {
		this._car[this.teamService.team].throwDice();
		this.save();
	}

	undo(): void {
		this._car[this.teamService.team].undo();
		this.save();
	}

	private save(): void {
		const json: CarListAndTeamSetupJson = {
			version: 1,
			yellow: this._car[Team.YELLOW].save(),
			red: this._car[Team.RED].save(),
			green: this._car[Team.GREEN].save(),
			blue: this._car[Team.BLUE].save(),
			violet: this._car[Team.VIOLET].save(),
			black: this._car[Team.BLACK].save(),
		};
		this.localStoreService.save(CarSetupService.STORE_KEY, json);
	}
}
