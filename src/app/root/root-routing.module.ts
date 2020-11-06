import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StartComponent} from '../start/start.component';
import {CarSetupComponent} from '../car-setup/car-setup.component';
import {RaceComponent} from '../race/race.component';
import {DiceComponent} from '../dice/dice.component';
import {TeamSelectComponent} from '../team-select/team-select.component';
import {WeatherComponent} from '../weather/weather.component';
import {CanActivateCarSetupGuard} from 'src/app/car-setup/can-activate-car-setup.guard';
import { ParcourComponent } from '../parcour/parcour.component';

const routes: Routes = [
    {path: '', component: StartComponent},
    {path: 'dice', component: DiceComponent},
    {path: 'team', component: TeamSelectComponent},
    {path: 'weather', component: WeatherComponent},
    {path: 'parcour', component: ParcourComponent},
    {path: 'carSetup', component: CarSetupComponent, canActivate: [CanActivateCarSetupGuard]},
    {path: 'race', component: RaceComponent},
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class RootRoutingModule { }
