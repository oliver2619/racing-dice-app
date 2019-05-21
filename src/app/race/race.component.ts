import {Component, ViewChild} from '@angular/core';
import {RaceService} from './race.service';
import {CarSetupService} from '../car-setup/car-setup.service';
import {JokerState, CarSetup} from '../model/carSetup';
import {DialogComponent} from '../dialog/dialog.component';
import {AudioService} from '../audio.service';

@Component({
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.css']
})
export class RaceComponent {

    @ViewChild(DialogComponent)
    private selectCurveDialog: DialogComponent;

    private _nextSpeed: number = 0;

    constructor(private raceService: RaceService, private carSetupService: CarSetupService, private audioService: AudioService) {
    }

    get maxSpeedInCurve(): number {
        return this.currentCar.getMaxSpeedInCurve(this.currentCurve, this.raceService.weather);
    }

    get speed(): number {
        return this.currentCar.speed;
    }

    get nextSpeed(): number {
        return this._nextSpeed;
    }

    set nextSpeed(speed: number) {
        this._nextSpeed = speed;
    }

    get nextSpeedOptions(): Array<number> {
        const ret: Array<number> = [];
        const car = this.currentCar;
        const minSpeed = car.nextMinSpeed;
        const maxSpeed = car.getNextMaxSpeed(this.raceService.weather);
        for (let i = minSpeed; i <= maxSpeed; ++i)
            ret.push(i);
        return ret;
    }

    get speedJokerNoFx(): boolean {
        return this.currentCar.speedJoker === JokerState.NO_EFFECT;
    }

    get speedJokerFailure(): boolean {
        return this.currentCar.speedJoker === JokerState.FAILURE;
    }

    get maxSpeed(): number {
        return this.currentCar.maxSpeed;
    }

    armSpeedJoker(): void {
        if (!this.isSpeedJokerArmed()) {
            this.currentCar.armSpeedJoker();
            if (this.speedJokerNoFx)
                this.audioService.motorFailure(false);
            else if (this.speedJokerFailure) {
                if (this.currentCar.totalHealth <= 0)
                    this.audioService.crash();
                else
                    this.audioService.motorFailure(true);
            } else
                this.audioService.click();
        }
    }

    isSpeedJokerArmed(): boolean {
        return this.currentCar.speedJoker !== JokerState.UNSET;
    }

    get fuel(): number {
        return this.currentCar.fuel;
    }

    get motorHealth(): number {
        return this.currentCar.motorHealth;
    }

    get tiresHealth(): number {
        return this.currentCar.tiresHealth;
    }

    get curves(): Array<number> {
        const ret: Array<number> = [];
        for (let i = 10; i <= 20; ++i) {
            ret.push(i);
        }
        return ret;
    }

    get currentCurve(): number {
        return this.currentCar.currentCurve;
    }

    set currentCurve(curve: number) {
        this.currentCar.currentCurve = curve;
        this.selectCurveDialog.close();
    }

    get curvesJokerNoFx(): boolean {
        return this.currentCar.curvesJoker === JokerState.NO_EFFECT;
    }

    get curvesJokerFailure(): boolean {
        return this.currentCar.curvesJoker === JokerState.FAILURE;
    }

    get currentSpeed(): number {
        return this.currentCar.speed;
    }

    canArmCurvesJoker(): boolean {
        return this.currentCar.canArmSpeedJoker(this.currentCar.currentCurve, this.raceService.weather);
    }
    
    armCurvesJoker(): void {
        if (!this.isCurvesJokerArmed()) {
            this.currentCar.armCurvesJoker();
            if (this.curvesJokerNoFx)
                this.audioService.tireFailure(false);
            else if (this.curvesJokerFailure) {
                if (this.currentCar.totalHealth <= 0)
                    this.audioService.crash();
                else
                    this.audioService.tireFailure(true);
            }else
                this.audioService.click();
        }
    }

    isCurvesJokerArmed(): boolean {
        return this.currentCar.curvesJoker !== JokerState.UNSET;
    }

    selectCurve(): void {
        this.selectCurveDialog.show();
    }

    calcMaxAcceleration(): void {
        this.currentCar.calcMaxAcceleration();
    }

    hasMaxAcceleration(): boolean {
        return this.currentCar.hasMaxAcceleration();
    }

    canGo(): boolean {
        return this.currentCar.canGo(this._nextSpeed, this.raceService.weather);
    }

    go(): void {
        this.currentCar.go(this._nextSpeed, this.raceService.weather);
    }

    horn(): void {
        this.audioService.horn(this.carSetupService.team);
    }

    isHorn(): boolean {
        return this.audioService.hornPlayed;
    }

    reset(): void {
        this.currentCar.reset();
    }

    private get currentCar(): CarSetup {
        return this.carSetupService.getSetup();
    }
}
