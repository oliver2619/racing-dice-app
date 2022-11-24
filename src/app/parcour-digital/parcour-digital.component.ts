import { Component } from '@angular/core';
import { ParcourService } from '../parcour/parcour.service';
import { CarSetupService } from '../car-setup/car-setup.service';

@Component({
	selector: 'app-parcour-digital',
	templateUrl: './parcour-digital.component.html',
	styleUrls: ['./parcour-digital.component.scss']
})
export class ParcourDigitalComponent {

	get canClear(): boolean {
		return false;
	}

	get driving(): boolean {
		return this.carSetupService.car.driving;
	}

	get rounds(): number {
		return this.parcourService.rounds;
	}

	get canDecRounds(): boolean {
		return this.rounds > 1;
	}

	get canIncRounds(): boolean {
		return this.rounds < 20;
	}

	constructor(private readonly parcourService: ParcourService, private carSetupService: CarSetupService) { }

	clear(): void {

	}

	decRounds(): void {
		--this.parcourService.rounds;
	}

	incRounds(): void {
		++this.parcourService.rounds;
	}

}
