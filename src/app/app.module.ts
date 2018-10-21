import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {RouterModule} from '@angular/router';
import { StartComponent } from './start/start.component';
import {RootModule} from './root/root.module';
import { CarSetupComponent } from './car-setup/car-setup.component';
import { RaceComponent } from './race/race.component';
import {CarSetupService} from './car-setup/car-setup.service';
import {RaceService} from './race/race.service';
import { DiceComponent } from './dice/dice.component';
import { TeamSelectComponent } from './team-select/team-select.component';
import { DialogComponent } from './dialog/dialog.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    CarSetupComponent,
    RaceComponent,
    DiceComponent,
    TeamSelectComponent,
    DialogComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RootModule
  ],
  providers: [CarSetupService, RaceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
