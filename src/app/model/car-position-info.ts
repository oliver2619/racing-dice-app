import { Lane } from "./parcour-types";

export interface CarPositionInfo {
    readonly tile: number;
    readonly field: number;
    readonly lane: Lane;
}