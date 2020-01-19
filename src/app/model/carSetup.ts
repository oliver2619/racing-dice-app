import {Team} from "./teams";
import {Weather} from "./race";

export enum JokerState {
    UNSET, DAMAGE, NO_EFFECT, SUCCESS, DAMAGE_SUCCESS
}

export enum BrakeJokerState {
    UNSET, DAMAGE_SUCCESS, SUCCESS
}

export enum TireType {
    RAIN, SUN
}

export enum DurabilityType {
    WEAK, NORMAL, STRONG
}

export class CarSetup {

    private _durability: DurabilityType = DurabilityType.NORMAL;
    private _flaps: number = 2;
    private _fuel: number = Math.floor(CarSetup.maxFuel * .8);
    private _gear: number = 2;
    private _speed: number = 0;
    private _tires: TireType = TireType.SUN;
    private _motorHealth: number = CarSetup.maxHealth;
    private _tiresHealth: number = CarSetup.maxHealth;
    private _currentCurve: number;
    private _curvesJoker: JokerState = JokerState.UNSET;
    private _speedJoker: JokerState = JokerState.UNSET;
    private _brakeJoker: BrakeJokerState = BrakeJokerState.UNSET;
    private _dice: number;

    constructor(private _team: Team) {
    }

    public static get maxFuel(): number {
        return 20;
    }

    public static get maxHealth(): number {
        return 5;
    }

    get brakeJoker(): BrakeJokerState {
        return this._brakeJoker;
    }

    get driving(): boolean {
        return this._speed > 0 || this._dice !== undefined;
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

    get maxSpeed(): number {
        let ret = 0;
        for (let dice = 0; dice < 100; ++dice) {
            ret += this.getMaxSpeedForDice(dice / 100);
        }
        return ret / 100;
    }

    get nextMinSpeed(): number {
        return Math.max(this._speed - (this._brakeJoker !== BrakeJokerState.UNSET ? 3 : 2), 0);
    }

    get speed(): number {
        return this._speed;
    }

    get speedJoker(): JokerState {
        return this._speedJoker;
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

    get totalHealth(): number {
        return Math.min(this._tiresHealth, this._motorHealth);
    }

    get alive(): boolean {
        return this.totalHealth > 0;
    }

    get diceThrown(): boolean {
        return this._dice !== undefined;
    }

    get challengeTotalSuccessTimes(): number {
        return Math.round(CarSetup.maxHealth * this.probabilityChallengeSuccess / this.probabilityChallengeDamage);
    }

    private get probabilityChallengeSuccess(): number {
        let ret = 0.65 + 0.2 * (this._durability - 1);
        if (this._team === Team.BLACK)
            ret += .05;
        else
            ret -= .05;
        return ret;
    }

    private get probabilityChallengeDamage(): number {
        let ret = .12 - 0.04 * (this._durability - 1);
        if (this._team === Team.BLACK)
            ret -= .01;
        else
            ret += .01;
        return ret;
    }

    canArmBrakeJoker(): boolean {
        return this._brakeJoker === BrakeJokerState.UNSET && this._speed > 2;
    }

    armBrakeJoker(): void {
        if (this._brakeJoker === BrakeJokerState.UNSET && this.alive) {
            this._brakeJoker = this.getBrakeJokerChallenge();
            if (this._brakeJoker === BrakeJokerState.DAMAGE_SUCCESS) {
                --this._tiresHealth;
                this.healthCheck();
            }
        }
    }

    canArmSpeedJoker(weather: Weather): boolean {
        // TODO only if maxSpeed < 6
        if (this._speedJoker !== JokerState.UNSET)
            return true;
        const oldSpeedJoker = this._speedJoker;
        const oldCurvesJoker = this._curvesJoker;
        if (this._curvesJoker === JokerState.UNSET)
            this._curvesJoker = JokerState.SUCCESS;
        this._speedJoker = JokerState.UNSET;
        const v1 = this.getNextSpeedOptions(weather).length;
        this._speedJoker = JokerState.SUCCESS;
        const v2 = this.getNextSpeedOptions(weather).length;
        this._speedJoker = oldSpeedJoker;
        this._curvesJoker = oldCurvesJoker;
        return v2 > v1;

    }

    armSpeedJoker(): void {
        if (this._speedJoker === JokerState.UNSET && this.alive) {
            this._speedJoker = this.getJokerChallenge();
            if (this._speedJoker === JokerState.DAMAGE || this._speedJoker === JokerState.DAMAGE_SUCCESS) {
                --this._motorHealth;
                this.healthCheck();
            }
        }
    }

    throwDice(): void {
        if (!this.diceThrown)
            this._dice = Math.random();
    }

    getAvgAcceleration(weather: Weather): number {
        let ret = 0;
        for (let dice = 0; dice < 100; ++dice) {
            ret += this.getAccelerationForDice(dice / 100, weather);
        }
        return ret / 100;
    }

    getNextMaxSpeed(weather: Weather): number {
        let accel: number;
        if (this._dice !== undefined)
            accel = this.getAccelerationForDice(this._dice, weather);
        else
            accel = 0;
        return Math.min(this._speed + accel, this.getMaxSpeedInCurve(this.currentCurve, weather));
    }

    getNextSpeedOptions(weather: Weather): number[] {
        const ret: number[] = [];
        const minSpeed = this.nextMinSpeed;
        const maxSpeed = this.getNextMaxSpeed(weather);
        for (let i = minSpeed; i <= maxSpeed; ++i)
            ret.push(i);
        return ret;
    }

    canArmCurvesJoker(weather: Weather): boolean {
        // TODO only if max speed < 6
        if (this._curvesJoker !== JokerState.UNSET)
            return true;
        const oldCurvesJoker = this._curvesJoker;
        const oldSpeedJoker = this._speedJoker;
        if (this._speedJoker === JokerState.UNSET)
            this._speedJoker = JokerState.SUCCESS;
        this._curvesJoker = JokerState.UNSET;
        const v1 = this.getNextSpeedOptions(weather).length;
        this._curvesJoker = JokerState.SUCCESS;
        const v2 = this.getNextSpeedOptions(weather).length;
        this._curvesJoker = oldCurvesJoker;
        this._speedJoker = oldSpeedJoker;
        return v2 > v1;
    }

    armCurvesJoker(): void {
        if (this._curvesJoker === JokerState.UNSET && this.alive) {
            this._curvesJoker = this.getJokerChallenge();
            if (this._curvesJoker === JokerState.DAMAGE || this._curvesJoker === JokerState.DAMAGE_SUCCESS) {
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

    // 1 .. 5
    getMaxSpeedInCurve(curve: number, weather: Weather): number {
        if (curve === undefined)
            return this.getMaxSpeedForDice(this._dice);
        const ms = this.getMaxSpeedForDice(.5);
        let ret = .3 + this.getBonusTires(weather) * (2 + this.getBonusFlaps() / 2) * (curve / 20) * 1.8 - .2 * this.getBonusDurability();
        if (this._team === Team.RED)
            ret += .1;
        else
            ret -= .1;
        ret = Math.round(ret);
        if (this._curvesJoker === JokerState.SUCCESS || this._curvesJoker === JokerState.DAMAGE_SUCCESS)
            ++ret;
        return Math.min(ret, ms);
    }

    repair(): void {
        this._motorHealth = CarSetup.maxHealth;
        this._tiresHealth = CarSetup.maxHealth;
        this.stop();
    }

    canGo(speed: number, weather: Weather): boolean {
        return speed >= this.nextMinSpeed && speed <= this.getNextMaxSpeed(weather);
    }

    go(speed: number, weather: Weather): void {
        if (this.canGo(speed, weather))
            this._speed = speed;
        this._speedJoker = JokerState.UNSET;
        this._curvesJoker = JokerState.UNSET;
        this._brakeJoker = BrakeJokerState.UNSET;
        this._dice = undefined;
    }

    giveUp(): void {
        this._speedJoker = JokerState.UNSET;
        this._curvesJoker = JokerState.UNSET;
        this._brakeJoker = BrakeJokerState.UNSET;
        this._dice = undefined;
        this._tiresHealth = 0;
        this._speed = 0;
    }

    stop(): void {
        this._speed = 0;
        this._speedJoker = JokerState.UNSET;
        this._curvesJoker = JokerState.UNSET;
        this._brakeJoker = BrakeJokerState.UNSET;
        this._dice = undefined;
    }

    private getAccelerationForDice(dice: number, weather: Weather): number {
        // 4.9 + .6 * gear is related to max speed
        let ret = Math.min(this.getBonusTires(weather), 4.3 / (4.9 + .6 * this.getBonusGear())) * 1.7 - .2 * this.getBonusDurability() - .1 * this.getBonusFlaps() + .3 * this.getBonusDice(dice);
        if (this._team === Team.VIOLET)
            ret += .1;
        else
            ret -= .1;
        ret = Math.round(ret);
        if (this._speedJoker === JokerState.SUCCESS || this._speedJoker === JokerState.DAMAGE_SUCCESS)
            ++ret;
        return ret;
    }

    private getMaxSpeedForDice(dice: number): number {
        if (!this.alive)
            return 0;
        // 4.9 + .6 * gear is related to acceleration
        let ret = 4.9 + .6 * this.getBonusGear() - .3 * this.getBonusFlaps() - .2 * this.getBonusDurability() + .3 * this.getBonusDice(dice);
        if (this._team === Team.BLUE)
            ret += .1;
        else
            ret -= .1;
        ret = Math.round(ret);
        if ((this._speedJoker === JokerState.SUCCESS || this._speedJoker === JokerState.DAMAGE_SUCCESS) && ret < 6)
            ++ret;
        return ret;
    }

    private getJokerChallenge(): JokerState {
        if (Math.random() < this.probabilityChallengeSuccess) {
            if (Math.random() < this.probabilityChallengeDamage)
                return JokerState.DAMAGE_SUCCESS;
            else
                return JokerState.SUCCESS;
        } else {
            if (Math.random() < this.probabilityChallengeDamage)
                return JokerState.DAMAGE;
            else
                return JokerState.NO_EFFECT;
        }
    }

    private getBrakeJokerChallenge(): BrakeJokerState {
        if (Math.random() < this.probabilityChallengeSuccess)
            return BrakeJokerState.SUCCESS;
        else
            return BrakeJokerState.DAMAGE_SUCCESS;
    }

    private healthCheck(): void {
        if (this.totalHealth <= 0)
            this._speed = 0;
    }

    // .5 .. 1
    private getBonusTires(weather: Weather): number {
        let bonus: number;
        switch (weather) {
            case Weather.SUN:
                bonus = this._tires === TireType.SUN ? 1 : .6;
                break;
            case Weather.CLOUDY:
                bonus = this._tires === TireType.SUN ? 1 : .7;
                break;
            case Weather.CLOUDS:
                bonus = this._tires === TireType.SUN ? .9 : .8;
                break;
            case Weather.RAIN_LITTLE:
                bonus = this._tires === TireType.SUN ? .7 : .9;
                break;
            case Weather.RAIN:
                bonus = this._tires === TireType.SUN ? .5 : .8;
                break;
            default:
                throw 'Unknown weather';
        }
        if (this._team === Team.YELLOW)
            bonus *= 1.04;
        return bonus;
    }

    // -1 .. 1
    private getBonusDice(dice: number): number {
        return dice * 2 - 1;
    }

    // -1 .. 1
    private getBonusFlaps(): number {
        return (this._flaps - 2) / 2;
    }

    // -1 .. 1
    private getBonusGear(): number {
        return (this._gear - 2) / 2;
    }

    // -1 .. 1
    private getBonusDurability(): number {
        let ret = this._durability - 1;
        if (this._team === Team.BLACK)
            ret += 1 / 2;
        else
            ret -= 1 / 2;
        return ret;
    }
}