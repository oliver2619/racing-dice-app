import {Team} from "./teams";
import {Weather} from "./race";

export enum JokerState {
    UNSET, FAILURE, NO_EFFECT, SUCCESS
}

export enum TireType {
    RAIN, SUN
}

export enum DurabilityType {
    WEAK, NORMAL, STRONG
}

export class CarSetup {

    private _durability: DurabilityType = 1;
    private _flaps: number = 1;
    private _fuel: number = Math.floor(CarSetup.maxFuel * .8);
    private _gear: number = 1;
    private _speed: number = 0;
    private _tires: TireType = TireType.SUN;
    private _motorHealth: number = 5;
    private _tiresHealth: number = 5;
    private _currentCurve: number;
    private _curvesJoker: JokerState = JokerState.UNSET;
    private _speedJoker: JokerState = JokerState.UNSET;
    private _currentAccelDice: number;

    constructor(private _team: Team) {
    }

    public static get maxFuel(): number {
        return 10;
    }

    public static get maxHealth(): number {
        return 5;
    }

    get durability(): DurabilityType {
        return this._durability;
    }

    set durability(durability: DurabilityType) {
        this._durability = durability;
    }

    get flaps(): number {
        return this._flaps;
    }

    set flaps(flaps: number) {
        this._flaps = flaps;
    }

    get fuel(): number {
        return this._fuel;
    }

    set fuel(fuel: number) {
        this._fuel = fuel;
    }

    get gear(): number {
        return this._gear;
    }

    set gear(gear: number) {
        this._gear = gear;
    }

    get nextMinSpeed(): number {
        return Math.max(this._speed - 2, 0);
    }

    getNextMaxSpeed(weather: Weather): number {
        let accel: number;
        if (this._currentAccelDice !== undefined)
            accel = this.getAccelerationForDice(this._currentAccelDice, weather);
        else
            accel = 0;
        return Math.min(this._speed + accel, this.getMaxSpeedInCurve(this.currentCurve, weather));
    }

    get maxSpeed(): number {
        if (this.totalHealth <= 0)
            return 0;
        let bonus = 15;
        bonus -= this.getBonusFlaps();
        bonus += this.getBonusGear();
        bonus -= this.getBonusDurability();
        if (this._team === Team.BLUE)
            ++bonus;
        let ret = Math.floor(bonus / 3);
        if (this._speedJoker === JokerState.SUCCESS)
            ++ret;
        return ret;
    }

    get speed(): number {
        return this._speed;
    }

    get speedJoker(): JokerState {
        return this._speedJoker;
    }

    armSpeedJoker(): void {
        if (this._speedJoker === JokerState.UNSET && this.totalHealth > 0) {
            this._speedJoker = this.getJokerChallenge();
            if (this._speedJoker === JokerState.FAILURE) {
                --this._motorHealth;
                this.healthCheck();
            }
        }
    }

    getAvgAcceleration(weather: Weather): number {
        let ret = 0;
        for (let dice1 = 1; dice1 <= 6; ++dice1) {
            for (let dice2 = 1; dice2 <= 6; ++dice2) {
                ret += this.getAccelerationForDice(dice1 + dice2, weather);
            }
        }
        return ret / 36;
    }

    calcMaxAcceleration(): void {
        if (!this.hasMaxAcceleration())
            this._currentAccelDice = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
    }

    hasMaxAcceleration(): boolean {
        return this._currentAccelDice !== undefined;
    }

    get tires(): TireType {
        return this._tires;
    }

    set tires(tires: TireType) {
        this._tires = tires;
    }

    get motorHealth(): number {
        return this._motorHealth;
    }

    get tiresHealth(): number {
        return this._tiresHealth;
    }

    get currentCurve(): number {
        return this._currentCurve;
    }

    set currentCurve(curve: number) {
        this._currentCurve = curve;
    }

    get curvesJoker(): JokerState {
        return this._curvesJoker;
    }

    canArmSpeedJoker(curve: number, weather: Weather): boolean {
        const oldJoker = this._curvesJoker;
        this._curvesJoker = JokerState.UNSET;
        const v1 = this.getMaxSpeedInCurve(curve, weather);
        this._curvesJoker = JokerState.SUCCESS;
        const v2 = this.getMaxSpeedInCurve(curve, weather);
        this._curvesJoker = oldJoker;
        return v2 > v1;
    }
    
    armCurvesJoker(): void {
        if (this._curvesJoker === JokerState.UNSET && this.totalHealth > 0) {
            this._curvesJoker = this.getJokerChallenge();
            if (this._curvesJoker === JokerState.FAILURE) {
                --this._tiresHealth;
                this.healthCheck();
            }
        }
    }

    getAvgSpeedInCurve(weather: Weather): number {
        let ret = 0;
        for (let c = 10; c <= 20; ++c) {
            ret += this.getMaxSpeedInCurve(c, weather);
        }
        return ret / 11;
    }

    getMaxSpeedInCurve(curve: number, weather: Weather): number {
        const ms = this.maxSpeed;
        if (curve === undefined)
            return ms;
        let bonus = -3;
        bonus += this.getBonusTires(weather);
        bonus += this.getBonusFlaps();
        bonus -= this.getBonusDurability();
        if (this._team === Team.RED)
            ++bonus;
        let ret = Math.floor((curve + bonus) / 3.5);
        if (this._curvesJoker === JokerState.SUCCESS)
            ++ret;
        return Math.min(ret, ms);

    }

    get totalHealth(): number {
        return Math.min(this._tiresHealth, this._motorHealth);
    }

    repair(): void {
        this._motorHealth = CarSetup.maxHealth;
        this._tiresHealth = CarSetup.maxHealth;
    }

    canGo(speed: number, weather: Weather): boolean {
        return speed >= this.nextMinSpeed && speed <= this.getNextMaxSpeed(weather);
    }

    go(speed: number, weather: Weather): void {
        if (this.canGo(speed, weather))
            this._speed = speed;
        this._speedJoker = JokerState.UNSET;
        this._curvesJoker = JokerState.UNSET;
        this._currentAccelDice = undefined;
    }

    reset(): void {
        this._speed = 0;
        this._speedJoker = JokerState.UNSET;
        this._curvesJoker = JokerState.UNSET;
        this._currentAccelDice = undefined;
    }
    
    private getAccelerationForDice(dice: number, weather: Weather): number {
        let bonus = 0;
        bonus += this.getBonusTires(weather);
        bonus -= this.getBonusGear();
        bonus -= this.getBonusDurability();
        if (this._team === Team.VIOLET)
            ++bonus;
        let ret = Math.floor((dice + bonus) / 5);
        if (this._speedJoker === JokerState.SUCCESS)
            ++ret;
        return ret;
    }

    private getJokerChallenge(): JokerState {
        let result = JokerState.FAILURE;
        let r;
        for (let i = 0; i < this.getJokerChallengeAmount(); ++i) {
            r = Math.floor(Math.random() * 3);
            if (r === 2)
                return JokerState.SUCCESS;
            else if (r === 1)
                result = JokerState.NO_EFFECT;
        }
        return result;
    }

    private getJokerChallengeAmount(): number {
        let ret = 0;
        if (this._team === Team.BLACK)
            ++ret;
        switch (this._durability) {
            case DurabilityType.WEAK:
                return ret + 1;
            case DurabilityType.NORMAL:
                return ret + 2;
            case DurabilityType.STRONG:
                return ret + 3;
            default:
                throw 'Unknown durability';
        }
    }

    private healthCheck(): void {
        if (this.totalHealth <= 0)
            this._speed = 0;
    }

    private getBonusTires(weather: Weather): number {
        let bonus = 0;
        if (this._team === Team.YELLOW)
            bonus += .5;
        switch (weather) {
            case Weather.SUN:
                return this._tires === TireType.SUN ? (bonus + 1) : (bonus - 1);
            case Weather.CLOUDY:
                return this._tires === TireType.SUN ? (bonus + 1) : (bonus - 1);
            case Weather.CLOUDS:
                return this._tires === TireType.SUN ? (bonus) : (bonus - 1);
            case Weather.RAIN_LITTLE:
                return this._tires === TireType.SUN ? (bonus - 1) : (bonus);
            case Weather.RAIN:
                return this._tires === TireType.SUN ? (bonus - 1) : (bonus);
            default:
                throw 'Unknown weather';
        }
    }

    private getBonusFlaps(): number {
        return this._flaps - 1;
    }

    private getBonusGear(): number {
        return (this._gear - 1) * 2;
    }

    private getBonusDurability(): number {
        let ret = this._durability - 1;
        if (this._team === Team.BLACK)
            ret += .5;
        return ret;
    }
}