import { FieldInfo } from "./field-info";
import { ParcourElement, ParcourElementData } from "./parcour-element";
import { ParcourElementJson } from "./parcour-json";
import { Lane, ParcourElementRotation, StraightLength } from "./parcour-types";

export interface ParcourElementStraightData extends ParcourElementData {
    length: StraightLength;
}

export class ParcourElementStraight extends ParcourElement {

    readonly isCurve = false;
    readonly curveSpeed = undefined;
    readonly curveTurn = undefined;
    readonly length: StraightLength;
    readonly endDirection: ParcourElementRotation;
    readonly width: number;
    readonly height: number;
    readonly nextOffsetX: number;
    readonly nextOffsetY: number;

    constructor(data: ParcourElementStraightData) {
        super(data);
        this.length = data.length;
        this.endDirection = data.rotation;
        if ((this.rotation & 1) === 1) {
            this.width = this.length;
            this.height = 4;
        } else {
            this.width = 4;
            this.height = this.length;
        }
        switch (this.endDirection) {
            case ParcourElementRotation.UP:
                this.nextOffsetX = this.x;
                this.nextOffsetY = this.y;
                break;
            case ParcourElementRotation.LEFT:
                this.nextOffsetX = this.x;
                this.nextOffsetY = this.y;
                break;
            case ParcourElementRotation.DOWN:
                this.nextOffsetX = this.x;
                this.nextOffsetY = this.y + this.height;
                break;
            case ParcourElementRotation.RIGHT:
                this.nextOffsetX = this.x + this.width;
                this.nextOffsetY = this.y;
        }
    }

    getCurve(relPosition: number): number | undefined {
        return undefined;
    }

    getField(field: number, lane: Lane): FieldInfo {
        let x = this.x;
        let y = this.y;
        switch (this.rotation) {
            case ParcourElementRotation.UP:
                x += lane === Lane.LEFT ? 1 : 2
                y += this.length - field - 1;
                break;
            case ParcourElementRotation.LEFT:
                x += this.length - field - 1;
                y += lane === Lane.LEFT ? 2 : 1;
                break;
            case ParcourElementRotation.DOWN:
                x += lane === Lane.LEFT ? 2 : 1
                y += field;
                break;
            case ParcourElementRotation.RIGHT:
                x += field;
                y += lane === Lane.LEFT ? 1 : 2;
        }
        return { x, y };
    }

    getLaneLength(lane: Lane): number {
        return this.length;
    }

    save(): ParcourElementJson {
        const ret: ParcourElementJson = {
            length: this.length
        };
        return ret;
    }

    withEndDirection(direction: ParcourElementRotation): ParcourElement {
        return new ParcourElementStraight({
            length: this.length,
            rotation: direction,
            x: this.x,
            y: this.y
        });
    }

    withPosition(x: number, y: number): ParcourElement {
        return new ParcourElementStraight({
            length: this.length,
            rotation: this.rotation,
            x,
            y
        });
    }

    withRotation(rotation: ParcourElementRotation): ParcourElement {
        return new ParcourElementStraight({
            length: this.length,
            rotation,
            x: this.x,
            y: this.y
        });
    }
}
