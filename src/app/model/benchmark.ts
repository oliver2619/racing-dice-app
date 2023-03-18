import { Car } from './car';
import { Weather } from './race';
import { ParcourInfo } from './parcour-info';

export class Benchmark {

	private static readonly SIMULATIONS = 5000;

	private position = 0;
	private time = 0;
	private distance = 0;
	private finished = false;

	constructor(private readonly car: Car, private readonly parcour: ParcourInfo, private readonly weather: Weather) { }

	run(): number {
		let ret = 0;
		for (let i = 0; i < Benchmark.SIMULATIONS; ++i) {
			ret += this.process();
		}
		return ret / Benchmark.SIMULATIONS;
	}

	private process(): number {
		this.position = 1;
		this.time = 0;
		this.distance = 0;
		this.finished = false;
		this.car.stop();
		this.car.repair();
		while (!this.finished) {
			this.processStep();
		}
		return this.distance / this.time;
	}

	private processStep(): void {
		this.car.throwDice();
		const maxSpeed = this.getMaxSpeed();
		const curve = this.getMinCurve(this.position, this.position + maxSpeed);
		this.car.curve = curve;
		if (this.car.canArmCurveJoker(this.weather) && this.car.tiresHealth > 1) {
			this.car.armCurveJoker();
		}
		if (this.car.canArmSpeedJoker(this.weather) && this.car.motorHealth > 1) {
			this.car.armSpeedJoker();
		}
		const speed = this.car.getNextMaxSpeed(this.weather);
		this.car.drive(speed, this.weather);
		this.position = (this.position + speed) % this.parcour.fields;
		this.distance += speed;
		++this.time;
		if (this.distance > this.parcour.fields * this.parcour.rounds) {
			this.finished = true;
		}
	}

	private getMinCurve(start: number, end: number): number | undefined {
		let ret: number | undefined;
		for (let i = start; i <= end; ++i) {
			const c = this.parcour.getCurve(i);
			if (ret === undefined) {
				ret = c;
			} else if (c !== undefined) {
				ret = Math.min(ret, c);
			}
		}
		return ret;
	}

	private getMaxSpeed(): number {
		// 6 + 4 + 2
		let s1 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position + 10, this.position + 12), this.weather);
		let s2 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position + 6, this.position + 10), this.weather);
		let s3 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position, this.position + 6), this.weather);
		if (s1 >= 2 && s2 >= 4 && s3 >= 6) {
			return 6;
		}
		// 5 + 3
		s1 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position + 5, this.position + 8), this.weather);
		s2 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position, this.position + 5), this.weather);
		if (s1 >= 3 && s2 >= 5) {
			return 5;
		}
		// 4 + 2
		s1 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position + 4, this.position + 6), this.weather);
		s2 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position, this.position + 4), this.weather);
		if (s1 >= 2 && s2 >= 4) {
			return 4;
		}
		// 3
		s1 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position, this.position + 3), this.weather);
		if (s1 >= 3) {
			return 3;
		}
		// 2
		s1 = this.car.getMaxSpeedInCurve(this.getMinCurve(this.position, this.position + 2), this.weather);
		if (s1 >= 2) {
			return 2;
		}
		return 1;
	}
}