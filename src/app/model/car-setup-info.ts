import { TireType } from './carSetup';
import { BrakeJokerState, JokerState } from './car-info';
import { Weather } from './race';
import { Team } from './teams';

export interface CarSetupInfo {

	readonly challengeTotalSuccessTimes: number;

	readonly durability: number;

	readonly flaps: number;

	readonly gear: number;

	readonly team: Team;
	
	readonly tires: TireType;
	
	getBrakeJokerChallenge(): BrakeJokerState;
	
	getBonusDice(dice: number): number;
	
	getBonusDurability(): number;
	
	getBonusFlaps(): number;
	
	getBonusGear(): number;
	
	getBonusTires(weather: Weather): number;
	
	getJokerChallenge(): JokerState;
}