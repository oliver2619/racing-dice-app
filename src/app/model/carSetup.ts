import { Team } from "./teams";
import { Weather } from "./race";
import { CarJson } from './car-json';
import { CarSetupInfo } from './car-setup-info';
import { BrakeJokerState, JokerState } from './car-info';

export enum TireType {
	RAIN, SUN
}

export enum DurabilityType {
	WEAK, NORMAL, STRONG
}

export class CarSetup implements CarSetupInfo {

	static readonly maxFuel = 20;
	static readonly maxHealth = 5;

	durability = DurabilityType.NORMAL;
	flaps = 2;
	gear = 2;
	tires = TireType.SUN;

	get challengeTotalSuccessTimes(): number {
		return Math.round(CarSetup.maxHealth * this.probabilityChallengeSuccess / this.probabilityChallengeDamage);
	}

	constructor(public readonly team: Team) {
	}

	getBrakeJokerChallenge(): BrakeJokerState {
		if (Math.random() < this.probabilityChallengeSuccess)
			return BrakeJokerState.SUCCESS;
		else
			return BrakeJokerState.DAMAGE_SUCCESS;
	}

	getJokerChallenge(): JokerState {
		if (Math.random() < this.probabilityChallengeSuccess) {
			if (Math.random() < this.probabilityChallengeDamage)
				return JokerState.DAMAGE_SUCCESS;
			else
				return JokerState.SUCCESS;
		} else {
			if (Math.random() < this.probabilityChallengeDamage)
				return JokerState.DAMAGE;
			else
				return JokerState.NO_EFFECT;
		}
	}

	load(json: CarJson): void {
		this.durability = (DurabilityType as any)[json.durability];
		this.flaps = json.flaps;
		this.gear = json.gear;
		this.tires = (TireType as any)[json.tires];
	}

	save(json: CarJson): void {
		json.durability = DurabilityType[this.durability];
		json.flaps = this.flaps;
		json.gear = this.gear;
		json.tires = TireType[this.tires];
	}

	// .5 .. 1
	getBonusTires(weather: Weather): number {
		let bonus: number;
		switch (weather) {
			case Weather.SUN:
				bonus = this.tires === TireType.SUN ? 1 : .6;
				break;
			case Weather.CLOUDY:
				bonus = this.tires === TireType.SUN ? 1 : .7;
				break;
			case Weather.CLOUDS:
				bonus = this.tires === TireType.SUN ? .9 : .8;
				break;
			case Weather.RAIN_LITTLE:
				bonus = this.tires === TireType.SUN ? .7 : .9;
				break;
			case Weather.RAIN:
				bonus = this.tires === TireType.SUN ? .5 : .8;
				break;
			default:
				throw 'Unknown weather';
		}
		if (this.team === Team.YELLOW)
			bonus *= 1.04;
		return bonus;
	}

	// -1 .. 1
	getBonusDice(dice: number): number {
		return dice * 2 - 1;
	}

	// -1 .. 1
	getBonusFlaps(): number {
		return (this.flaps - 2) / 2;
	}

	// -1 .. 1
	getBonusGear(): number {
		return (this.gear - 2) / 2;
	}

	// -1 .. 1
	getBonusDurability(): number {
		let ret = this.durability - 1;
		if (this.team === Team.BLACK)
			ret += 1 / 2;
		else
			ret -= 1 / 2;
		return ret;
	}

	private get probabilityChallengeSuccess(): number {
		let ret = 0.65 + 0.2 * (this.durability - 1);
		if (this.team === Team.BLACK)
			ret += .05;
		else
			ret -= .05;
		return ret;
	}

	private get probabilityChallengeDamage(): number {
		let ret = .12 - 0.04 * (this.durability - 1);
		if (this.team === Team.BLACK)
			ret -= .01;
		else
			ret += .01;
		return ret;
	}
}