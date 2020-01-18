import {Component, ViewChild} from '@angular/core';
import {CarSetup} from '../model/carSetup';
import {CarSetupService} from './car-setup.service';
import {RaceService} from '../race/race.service';
import {DialogComponent} from '../dialog/dialog.component';

@Component({
    selector: 'app-car-setup',
    templateUrl: './car-setup.component.html',
    styleUrls: ['./car-setup.component.css']
})
export class CarSetupComponent {

    @ViewChild(DialogComponent, {static: true})
    private dlgTeams: DialogComponent;

    constructor(private carSetupService: CarSetupService, private raceService: RaceService) {}

    get avgSpeedInCurve(): number {
        return this.car.getAvgSpeedInCurve(this.raceService.weather);
    }

    get avgAcceleration(): number {
        return this.car.getAvgAcceleration(this.raceService.weather);
    }

    get car(): CarSetup {
        return this.carSetupService.getSetup();
    }

    get challengeSuccessTimes(): number {
        return this.car.challengeTotalSuccessTimes;
    }
    
    canDecFuel(): boolean {
        return this.car.fuel > 1;
    }

    canIncFuel(): boolean {
        return this.car.fuel < CarSetup.maxFuel;
    }

    decFuel(): void {
        if (this.canDecFuel())
            this.car.fuel--;
    }

    incFuel(): void {
        if (this.canIncFuel())
            this.car.fuel++;
    }

    needsRepair(): boolean {
        return this.car.totalHealth < CarSetup.maxHealth;
    }

    repair(): void {
        this.car.repair();
    }

    about(): void {
        this.dlgTeams.show();
    }
}
