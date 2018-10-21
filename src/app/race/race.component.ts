import {Component, OnInit, ViewChild} from '@angular/core';
import {Team} from '../model/teams';
import {RaceService} from './race.service';
import {Weather} from '../model/race';
import {CarSetupService} from '../car-setup/car-setup.service';
import {JokerState, CarSetup} from '../model/carSetup';
import {TeamSelectComponent} from '../team-select/team-select.component';
import {DialogComponent} from '../dialog/dialog.component';

@Component({
    selector: 'app-race',
    templateUrl: './race.component.html',
    styleUrls: ['./race.component.css']
})
export class RaceComponent implements OnInit {

    @ViewChild(DialogComponent)
    private selectCurveDialog: DialogComponent;

    private _nextSpeed: number = 0;
    private _weatherShuffleInterval: number;
    private _weatherShuffleTimeout: number;

    private _horn = new Audio('assets/sounds/horn.mp3');
    private _hornPlayed = false;

    constructor(private raceService: RaceService, private carSetupService: CarSetupService) {
        this._horn.addEventListener('ended', (ev: MediaStreamErrorEvent) => {this._hornPlayed = false;});
    }

    ngOnInit() {
    }

    get weather(): Weather {
        return this.raceService.weather;
    }

    set weather(weather: Weather) {
        this.raceService.weather = weather;
    }

    get maxSpeedInCurve(): number {
        return this.currentCar.getMaxSpeedInCurve(this.currentCurve, this.weather);
    }

    isShufflingWeather(): boolean {
        return this._weatherShuffleTimeout !== undefined;
    }

    shuffleWeather(): void {
        if (this.isShufflingWeather())
            return;
        this._weatherShuffleInterval = window.setInterval(() => {
            this.raceService.shuffleWeather();
        }, 100);
        this._weatherShuffleTimeout = window.setTimeout(() => {
            window.clearInterval(this._weatherShuffleInterval);
            this._weatherShuffleInterval = undefined;
            this._weatherShuffleTimeout = undefined;
        }, 1000);

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
        const maxSpeed = car.getNextMaxSpeed(this.weather);
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
        this.currentCar.armSpeedJoker();
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

    armCurvesJoker(): void {
        this.currentCar.armCurvesJoker();
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
        return this.currentCar.canGo(this._nextSpeed, this.weather);
    }

    go(): void {
        this.currentCar.go(this._nextSpeed, this.weather);
    }

    horn(): void {
        if (!this._hornPlayed) {
            this._horn.play();
            this._hornPlayed = true;
        }
    }

    isHorn(): boolean {
        return this._hornPlayed;
    }

    reset(): void {
        this.currentCar.reset();
    }
    
    private get currentCar(): CarSetup {
        return this.carSetupService.getSetup();
    }
}
