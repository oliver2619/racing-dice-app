import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {StartComponent} from './start/start.component';
import {RootModule} from './root/root.module';
import {CarSetupComponent} from './car-setup/car-setup.component';
import {RaceComponent} from './race/race.component';
import {CarSetupService} from './car-setup/car-setup.service';
import {RaceService} from './race/race.service';
import {DiceComponent} from './dice/dice.component';
import {TeamSelectComponent} from './team-select/team-select.component';
import {DialogComponent} from './dialog/dialog.component';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import { WeatherComponent } from './weather/weather.component';
import {AppService} from './app.service';
import {AudioService} from './audio.service';
import { ButtonDirective } from './button.directive';
import { HealthComponent } from './health/health.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NumberDisplayValueComponent } from './number-display-value/number-display-value.component';
import { ParcourComponent } from './parcour/parcour.component';
import { EditParcourElementComponent } from './edit-parcour-element/edit-parcour-element.component';
import { SettingsComponent } from './settings/settings.component';
import { RaceDigitalComponent } from './race-digital/race-digital.component';
import { RacePhysicalComponent } from './race-physical/race-physical.component';
import { ParcourDigitalComponent } from './parcour-digital/parcour-digital.component';
import { ParcourPhysicalComponent } from './parcour-physical/parcour-physical.component';
import { ParcourCanvasComponent } from './parcour-canvas/parcour-canvas.component';


@NgModule({
    declarations: [
        AppComponent,
        StartComponent,
        CarSetupComponent,
        RaceComponent,
        DiceComponent,
        TeamSelectComponent,
        DialogComponent,
        NavBarComponent,
        WeatherComponent,
        ButtonDirective,
        HealthComponent,
        CanvasComponent,
        NumberDisplayValueComponent,
        ParcourComponent,
        EditParcourElementComponent,
        SettingsComponent,
        RaceDigitalComponent,
        RacePhysicalComponent,
        ParcourDigitalComponent,
        ParcourPhysicalComponent,
        ParcourCanvasComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        RootModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [CarSetupService, RaceService, AppService, AudioService],
    bootstrap: [AppComponent]
})
export class AppModule {}
