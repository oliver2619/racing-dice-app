import { CurveLength, ParcourElementRotation, StraightLength } from "./parcour-types";

export interface ParcourElementInfo {

    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly length: CurveLength | StraightLength;
    readonly rotation: ParcourElementRotation;
    readonly endDirection: ParcourElementRotation;
    readonly isCurve: boolean;
    readonly curveSpeed: number | undefined;
}