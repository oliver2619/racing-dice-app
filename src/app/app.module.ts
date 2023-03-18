import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonDirective } from './button.directive';
import { CanvasComponent } from './canvas/canvas.component';
import { CarSetupComponent } from './car-setup/car-setup.component';
import { DialogComponent } from './dialog/dialog.component';
import { DiceComponent } from './dice/dice.component';
import { HealthComponent } from './health/health.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NumberDisplayValueComponent } from './number-display-value/number-display-value.component';
import { ParcourCanvasComponent } from './parcour-canvas/parcour-canvas.component';
import { ParcourComponent } from './parcour/parcour.component';
import { RaceDigitalComponent } from './race-digital/race-digital.component';
import { RacePhysicalComponent } from './race-physical/race-physical.component';
import { RaceComponent } from './race/race.component';
import { SettingsComponent } from './settings/settings.component';
import { StartComponent } from './start/start.component';
import { TeamSelectComponent } from './team-select/team-select.component';
import { WeatherComponent } from './weather/weather.component';
import { InputDirective } from './input.directive';
// import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    ButtonDirective,
    CanvasComponent,
    CarSetupComponent,
    DialogComponent,
    DiceComponent,
    HealthComponent,
    NavBarComponent,
    NumberDisplayValueComponent,
    ParcourCanvasComponent,
    ParcourComponent,
    RaceDigitalComponent,
    RacePhysicalComponent,
    RaceComponent,
    SettingsComponent,
    StartComponent,
    TeamSelectComponent,
    WeatherComponent,
    InputDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: true,
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000'
    // })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
