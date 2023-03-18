import { CurveLength, StraightLength, ParcourElementRotation } from "./parcour-types";

export interface ParcourElementJson {
	length: CurveLength | StraightLength;
	curve?: {
		speed: number;
		turn: 'l' | 'r';
	}
}

export interface ParcourJson {
	version: 1 | 2;
}

export interface ParcourJson2 extends ParcourJson {
	version: 2;
	rounds: number;
	rotation: ParcourElementRotation;
	elements: ParcourElementJson[];
}
