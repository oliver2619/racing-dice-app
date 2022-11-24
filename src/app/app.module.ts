import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonDirective } from './button.directive';
import { CanvasComponent } from './canvas/canvas.component';
import { CarSetupComponent } from './car-setup/car-setup.component';
import { DialogComponent } from './dialog/dialog.component';
import { DiceComponent } from './dice/dice.component';
import { EditParcourElementComponent } from './edit-parcour-element/edit-parcour-element.component';
import { HealthComponent } from './health/health.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NumberDisplayValueComponent } from './number-display-value/number-display-value.component';
import { ParcourCanvasComponent } from './parcour-canvas/parcour-canvas.component';
import { ParcourDigitalComponent } from './parcour-digital/parcour-digital.component';
import { ParcourPhysicalComponent } from './parcour-physical/parcour-physical.component';
import { ParcourComponent } from './parcour/parcour.component';
import { RaceDigitalComponent } from './race-digital/race-digital.component';
import { RacePhysicalComponent } from './race-physical/race-physical.component';
import { RaceComponent } from './race/race.component';
import { SettingsComponent } from './settings/settings.component';
import { StartComponent } from './start/start.component';
import { TeamSelectComponent } from './team-select/team-select.component';
import { WeatherComponent } from './weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonDirective,
    CanvasComponent,
    CarSetupComponent,
    DialogComponent,
    DiceComponent,
    EditParcourElementComponent,
    HealthComponent,
    NavBarComponent,
    NumberDisplayValueComponent,
    ParcourCanvasComponent,
    ParcourDigitalComponent,
    ParcourPhysicalComponent,
    ParcourComponent,
    RaceDigitalComponent,
    RacePhysicalComponent,
    RaceComponent,
    SettingsComponent,
    StartComponent,
    TeamSelectComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
