import { Weather } from './race';
import { CarSetupInfo } from './car-setup-info';

export enum JokerState {
	UNSET, DAMAGE, NO_EFFECT, SUCCESS, DAMAGE_SUCCESS
}

export enum BrakeJokerState {
	UNSET, DAMAGE_SUCCESS, SUCCESS
}

export interface CarInfo {

	readonly alive: boolean;

	readonly brakeJoker: BrakeJokerState;

	readonly canArmBrakeJoker: boolean;

	readonly canUndo: boolean;

	readonly curve: number | undefined;

	readonly curveJoker: JokerState;

	readonly diceThrown: boolean;

	readonly driving: boolean;

	readonly fuel: number;

	readonly maxSpeed: number;

	readonly motorHealth: number;

	readonly setup: CarSetupInfo;

	readonly speed: number;

	readonly speedJoker: JokerState;

	readonly tiresHealth: number;

	readonly totalHealth: number;

	canArmCurveJoker(weather: Weather): boolean;

	canArmSpeedJoker(weather: Weather): boolean;

	canGo(speed: number, weather: Weather): boolean;

	getAvgAcceleration(weather: Weather): number;

	getAvgSpeedInCurve(weather: Weather): number;

	getMaxSpeedInCurve(curve: number | undefined, weather: Weather): number;

	getNextSpeedOptions(weather: Weather): number[];
}
