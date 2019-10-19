import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {CarSetupService} from 'src/app/car-setup/car-setup.service';

@Injectable({
    providedIn: 'root'
})
export class CanActivateCarSetupGuard implements CanActivate {

    constructor(private carSetupService: CarSetupService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        if (this.carSetupService.getSetup().driving) {
            this.router.navigateByUrl('/race');
            return false;
        }
        return true;
    }

}
