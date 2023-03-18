import { FieldInfo } from "./field-info";
import { ParcourElementInfo } from "./parcour-element-info";
import { ParcourElementJson } from "./parcour-json";
import { ParcourElementRotation, CurveLength, StraightLength, Lane, CurveTurn } from "./parcour-types";

export interface ParcourElementData {
    x: number;
    y: number;
    rotation: ParcourElementRotation;
}

export abstract class ParcourElement implements ParcourElementInfo {

    abstract readonly isCurve: boolean;
    abstract readonly curveSpeed: number | undefined;
    abstract readonly curveTurn: CurveTurn | undefined;
    abstract readonly length: CurveLength | StraightLength;
    abstract readonly endDirection: ParcourElementRotation;
    abstract readonly width: number;
    abstract readonly height: number;
    abstract readonly nextOffsetX: number;
    abstract readonly nextOffsetY: number;

    readonly x: number;
    readonly y: number;
    readonly rotation: ParcourElementRotation;

    protected constructor(data: ParcourElementData) {
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
    }

    abstract getCurve(relPosition: number): number | undefined;

    abstract getField(field: number, lane: Lane): FieldInfo;

    abstract getLaneLength(lane: Lane): number;

    abstract save(): ParcourElementJson;

    abstract withEndDirection(direction: ParcourElementRotation): ParcourElement;

    abstract withPosition(x: number, y: number): ParcourElement;

    abstract withRotation(rotation: ParcourElementRotation): ParcourElement;
}
