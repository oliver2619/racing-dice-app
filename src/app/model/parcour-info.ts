import { CarPositionInfo } from "./car-position-info";

export interface ParcourInfo {

    readonly fields: number;
    readonly rounds: number;

    getCurve(position: number): number | undefined;

    getStartPosition(position: number): CarPositionInfo;
}