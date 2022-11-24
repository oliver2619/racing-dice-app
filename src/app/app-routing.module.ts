import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarSetupComponent } from './car-setup/car-setup.component';
import { DiceComponent } from './dice/dice.component';
import { ParcourComponent } from './parcour/parcour.component';
import { RaceComponent } from './race/race.component';
import { SettingsComponent } from './settings/settings.component';
import { StartComponent } from './start/start.component';
import { TeamSelectComponent } from './team-select/team-select.component';
import { WeatherComponent } from './weather/weather.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'about' },
  { path: 'about', component: StartComponent },
  { path: 'dice', component: DiceComponent },
  { path: 'team', component: TeamSelectComponent },
  { path: 'weather', component: WeatherComponent },
  { path: 'parcour', component: ParcourComponent },
  { path: 'carSetup', component: CarSetupComponent },
  { path: 'race', component: RaceComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'about' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
