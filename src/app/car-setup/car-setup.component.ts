import { Component, ViewChild, OnInit } from '@angular/core';
import { CarSetup } from '../model/carSetup';
import { CarSetupService } from './car-setup.service';
import { RaceService } from '../race/race.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ParcourService } from '../parcour/parcour.service';
import { CarSetupInfo } from '../model/car-setup-info';

@Component({
	selector: 'app-car-setup',
	templateUrl: './car-setup.component.html',
	styleUrls: ['./car-setup.component.css']
})
export class CarSetupComponent implements OnInit {

	private _benchmark = 0;

	@ViewChild(DialogComponent, { static: true })
	private dlgTeams: DialogComponent;

	get avgAcceleration(): number {
		return this.carSetupService.car.getAvgAcceleration(this.raceService.weather);
	}

	get avgSpeedInCurve(): number {
		return this.carSetupService.car.getAvgSpeedInCurve(this.raceService.weather);
	}

	get benchmarkValue(): number {
		return this._benchmark;
	}

	get carSetup(): CarSetupInfo {
		return this.carSetupService.car.setup;
	}

	get challengeSuccessTimes(): number {
		return this.carSetupService.car.setup.challengeTotalSuccessTimes;
	}

	get maxSpeed(): number {
		return this.carSetupService.car.maxSpeed;
	}

	get needsRepair(): boolean {
		return this.carSetupService.car.totalHealth < CarSetup.maxHealth;
	}

	get driving(): boolean {
		return this.carSetupService.car.driving;
	}

	constructor(private carSetupService: CarSetupService, private raceService: RaceService, private parcourService: ParcourService) { }
	
	ngOnInit(): void {
		this.updateBenchmark();
	}

	about(): void {
		this.dlgTeams.show();
	}

	canDecFuel(): boolean {
		return this.carSetupService.car.fuel > 1;
	}

	canIncFuel(): boolean {
		return this.carSetupService.car.fuel < CarSetup.maxFuel;
	}

	decFuel(): void {
		if (this.canDecFuel()) {
			this.carSetupService.changeFuel(-1);
			this.updateBenchmark();
		}
	}

	incFuel(): void {
		if (this.canIncFuel()) {
			this.carSetupService.changeFuel(1);
			this.updateBenchmark();
		}
	}

	repair(): void {
		this.carSetupService.repair();
	}

	setDurability(dur: number): void {
		this.carSetupService.setDurability(dur);
		this.updateBenchmark();
	}

	setFlaps(flaps: number): void {
		this.carSetupService.setFlaps(flaps);
		this.updateBenchmark();
	}

	setGear(gear: number): void {
		this.carSetupService.setGear(gear);
		this.updateBenchmark();
	}

	setTires(tires: number): void {
		this.carSetupService.setTires(tires);
		this.updateBenchmark();
	}

	private updateBenchmark(): void {
		this._benchmark = this.carSetupService.benchmark(this.parcourService.parcour);
	}
}
