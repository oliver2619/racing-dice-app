import { CarSetup, DurabilityType, TireType } from './carSetup';
import { Weather } from './race';
import { CarInfo, JokerState, BrakeJokerState } from './car-info';
import { CarJson } from './car-json';
import { Team } from './teams';

interface UndoElement {
	speed: number;
	dice: number;
	curveJoker: JokerState;
	speedJoker: JokerState;
	brakeJoker: BrakeJokerState;
}

export class Car implements CarInfo {

	fuel: number = Math.floor(CarSetup.maxFuel * .8);
	curve: number | undefined;

	private _speed: number = 0;
	private _curveJoker: JokerState = JokerState.UNSET;
	private _speedJoker: JokerState = JokerState.UNSET;
	private _brakeJoker: BrakeJokerState = BrakeJokerState.UNSET;
	private _dice: number | undefined;
	private _motorHealth: number = CarSetup.maxHealth;
	private _tiresHealth: number = CarSetup.maxHealth;
	private _undo: UndoElement | undefined;

	get alive(): boolean {
		return this.totalHealth > 0;
	}

	get brakeJoker(): BrakeJokerState {
		return this._brakeJoker;
	}

	get canArmBrakeJoker(): boolean {
		return this._brakeJoker === BrakeJokerState.UNSET && this._speed > 2;
	}

	get canUndo(): boolean {
		return this._undo !== undefined;
	}

	get curveJoker(): number {
		return this._curveJoker;
	}

	get diceThrown(): boolean {
		return this._dice !== undefined;
	}

	get driving(): boolean {
		return this._speed > 0 || this._dice !== undefined;
	}

	get maxSpeed(): number {
		let ret = 0;
		for (let dice = 0; dice < 100; ++dice) {
			ret += this.getMaxSpeedForDice(dice / 100);
		}
		return ret / 100;
	}

	get motorHealth(): number {
		return this._motorHealth;
	}

	get nextMinSpeed(): number {
		return Math.max(this._speed - (this._brakeJoker !== BrakeJokerState.UNSET ? 3 : 2), 0);
	}

	get speed(): number {
		return this._speed;
	}

	get speedJoker(): JokerState {
		return this._speedJoker;
	}

	get tiresHealth(): number {
		return this._tiresHealth;
	}

	get totalHealth(): number {
		return Math.min(this._tiresHealth, this._motorHealth);
	}

	constructor(readonly setup: CarSetup) {
	}

	armBrakeJoker(): void {
		if (this._brakeJoker === BrakeJokerState.UNSET && this.alive) {
			this._brakeJoker = this.setup.getBrakeJokerChallenge();
			if (this._brakeJoker === BrakeJokerState.DAMAGE_SUCCESS) {
				--this._tiresHealth;
				this.healthCheck();
			}
		}
	}

	armCurveJoker(): void {
		if (this._curveJoker === JokerState.UNSET && this.alive) {
			this._curveJoker = this.setup.getJokerChallenge();
			if (this._curveJoker === JokerState.DAMAGE || this._curveJoker === JokerState.DAMAGE_SUCCESS) {
				--this._tiresHealth;
				this.healthCheck();
			}
		}
	}

	armSpeedJoker(): void {
		if (this._speedJoker === JokerState.UNSET && this.alive) {
			this._speedJoker = this.setup.getJokerChallenge();
			if (this._speedJoker === JokerState.DAMAGE || this._speedJoker === JokerState.DAMAGE_SUCCESS) {
				--this._motorHealth;
				this.healthCheck();
			}
		}
	}

	canArmCurveJoker(weather: Weather): boolean {
		// TODO only if max speed < 6
		if (this._curveJoker !== JokerState.UNSET)
			return true;
		const oldCurvesJoker = this._curveJoker;
		const oldSpeedJoker = this._speedJoker;
		if (this._speedJoker === JokerState.UNSET)
			this._speedJoker = JokerState.SUCCESS;
		this._curveJoker = JokerState.UNSET;
		const v1 = this.getNextSpeedOptions(weather).length;
		this._curveJoker = JokerState.SUCCESS;
		const v2 = this.getNextSpeedOptions(weather).length;
		this._curveJoker = oldCurvesJoker;
		this._speedJoker = oldSpeedJoker;
		return v2 > v1;
	}

	canArmSpeedJoker(weather: Weather): boolean {
		// TODO only if maxSpeed < 6
		if (this._speedJoker !== JokerState.UNSET)
			return true;
		const oldSpeedJoker = this._speedJoker;
		const oldCurvesJoker = this._curveJoker;
		if (this._curveJoker === JokerState.UNSET)
			this._curveJoker = JokerState.SUCCESS;
		this._speedJoker = JokerState.UNSET;
		const v1 = this.getNextSpeedOptions(weather).length;
		this._speedJoker = JokerState.SUCCESS;
		const v2 = this.getNextSpeedOptions(weather).length;
		this._speedJoker = oldSpeedJoker;
		this._curveJoker = oldCurvesJoker;
		return v2 > v1;
	}

	canGo(speed: number, weather: Weather): boolean {
		return speed >= this.nextMinSpeed && speed <= this.getNextMaxSpeed(weather);
	}

	clone(): Car {
		const ret = new Car(this.setup);
		ret.stop();
		return ret;
	}

	drive(speed: number, weather: Weather): void {
		if (this.canGo(speed, weather) && this._dice !== undefined) {
			this._undo = {
				brakeJoker: this._brakeJoker,
				curveJoker: this._curveJoker,
				dice: this._dice,
				speed: this._speed,
				speedJoker: this._speedJoker
			};
			this._speed = speed;
			this._speedJoker = JokerState.UNSET;
			this._curveJoker = JokerState.UNSET;
			this._brakeJoker = BrakeJokerState.UNSET;
			this._dice = undefined;
		}
	}

	getAvgAcceleration(weather: Weather): number {
		let ret = 0;
		for (let dice = 0; dice < 100; ++dice) {
			ret += this.getAccelerationForDice(dice / 100, weather);
		}
		return ret / 100;
	}

	getAvgSpeedInCurve(weather: Weather): number {
		let ret = 0;
		for (let c = 10; c <= 20; ++c) {
			ret += this.getMaxSpeedInCurve(c, weather);
		}
		return ret / 11;
	}

	// 1 .. 5
	getMaxSpeedInCurve(curve: number | undefined, weather: Weather): number {
		if(this._dice === undefined) {
			throw new Error('No dice was thrown');
		}
		const ms = this.getMaxSpeedForDice(this._dice);
		if (curve === undefined)
			return ms;
		let ret = .3 + this.setup.getBonusTires(weather) * (2 + this.setup.getBonusFlaps() / 2) * (curve / 20) * 1.8 - .2 * this.setup.getBonusDurability();
		if (this.setup.team === Team.RED)
			ret += .1;
		else
			ret -= .1;
		ret = Math.round(ret);
		if (this._curveJoker === JokerState.SUCCESS || this._curveJoker === JokerState.DAMAGE_SUCCESS)
			++ret;
		return Math.min(ret, ms);
	}

	getNextMaxSpeed(weather: Weather): number {
		let accel: number;
		if (this._dice !== undefined)
			accel = this.getAccelerationForDice(this._dice, weather);
		else
			accel = 0;
		return Math.min(this._speed + accel, this.getMaxSpeedInCurve(this.curve, weather));
	}

	getNextSpeedOptions(weather: Weather): number[] {
		const ret: number[] = [];
		const minSpeed = this.nextMinSpeed;
		const maxSpeed = this.getNextMaxSpeed(weather);
		for (let i = minSpeed; i <= maxSpeed; ++i)
			ret.push(i);
		return ret;
	}

	giveUp(): void {
		this._speedJoker = JokerState.UNSET;
		this._curveJoker = JokerState.UNSET;
		this._brakeJoker = BrakeJokerState.UNSET;
		this._dice = undefined;
		this._tiresHealth = 0;
		this._speed = 0;
		this._undo = undefined;
	}

	load(json: CarJson): void {
		this.fuel = json.fuel;
		this._speed = json.speed;
		this._motorHealth = json.motorHealth;
		this._tiresHealth = json.tiresHealth;
		this.curve = json.currentCurve;
		this._curveJoker = (JokerState as any)[json.curvesJoker];
		this._speedJoker = (JokerState as any)[json.speedJoker];
		this._brakeJoker = (BrakeJokerState as any)[json.brakeJoker];
		this._dice = json.dice;
		this.setup.load(json);
	}

	repair(): void {
		this._motorHealth = CarSetup.maxHealth;
		this._tiresHealth = CarSetup.maxHealth;
		this.stop();
	}

	save(): CarJson {
		const ret: CarJson = {
			durability: DurabilityType[0],
			flaps: 0,
			fuel: this.fuel,
			gear: 0,
			speed: this._speed,
			tires: TireType[0],
			motorHealth: this._motorHealth,
			tiresHealth: this._tiresHealth,
			currentCurve: this.curve,
			curvesJoker: JokerState[this._curveJoker],
			speedJoker: JokerState[this._speedJoker],
			brakeJoker: BrakeJokerState[this._brakeJoker],
			dice: this._dice
		};
		this.setup.save(ret);
		return ret;
	}

	stop(): void {
		this._speed = 0;
		this._speedJoker = JokerState.UNSET;
		this._curveJoker = JokerState.UNSET;
		this._brakeJoker = BrakeJokerState.UNSET;
		this._dice = undefined;
		this._undo = undefined;
	}

	throwDice(): void {
		if (!this.diceThrown) {
			this._dice = Math.random();
			this._undo = undefined;
		}
	}

	undo(): void {
		if (this._undo !== undefined) {
			this._brakeJoker = this._undo.brakeJoker;
			this._curveJoker = this._undo.curveJoker;
			this._dice = this._undo.dice;
			this._speed = this._undo.speed;
			this._speedJoker = this._undo.speedJoker;
			this._undo = undefined;
		}
	}

	private getAccelerationForDice(dice: number, weather: Weather): number {
		// 4.9 + .6 * gear is related to max speed
		let ret = Math.min(this.setup.getBonusTires(weather), 4.3 / (4.9 + .6 * this.setup.getBonusGear())) * 1.7 - .2 * this.setup.getBonusDurability() - .1 * this.setup.getBonusFlaps() + .3 * this.setup.getBonusDice(dice);
		if (this.setup.team === Team.VIOLET)
			ret += .1;
		else
			ret -= .1;
		ret = Math.round(ret);
		if (this._speedJoker === JokerState.SUCCESS || this._speedJoker === JokerState.DAMAGE_SUCCESS)
			++ret;
		return ret;
	}

	private getMaxSpeedForDice(dice: number): number {
		if (!this.alive)
			return 0;
		// 4.9 + .6 * gear is related to acceleration
		let ret = 4.9 + .6 * this.setup.getBonusGear() - .3 * this.setup.getBonusFlaps() - .2 * this.setup.getBonusDurability() + .3 * this.setup.getBonusDice(dice);
		if (this.setup.team === Team.BLUE)
			ret += .1;
		else
			ret -= .1;
		ret = Math.round(ret);
		if ((this._speedJoker === JokerState.SUCCESS || this._speedJoker === JokerState.DAMAGE_SUCCESS) && ret < 6)
			++ret;
		return ret;
	}

	private healthCheck(): void {
		if (this.totalHealth <= 0)
			this._speed = 0;
	}
}
