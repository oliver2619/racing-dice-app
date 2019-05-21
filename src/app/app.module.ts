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
        ButtonDirective
    ],
    imports: [
        BrowserModule,
        RouterModule,
        RootModule
    ],
    providers: [CarSetupService, RaceService, AppService, AudioService],
    bootstrap: [AppComponent]
})
export class AppModule {}
