import {Component} from '@angular/core';
import {AppService} from '../app.service';
import {AudioService} from '../audio.service';
import {CarSetupService} from '../car-setup/car-setup.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

    constructor(private appService: AppService, private audioService: AudioService, private carSetupService: CarSetupService) {}

    get fullscreen(): boolean {
        return this.appService.fullscreen;
    }

    get soundLevel(): number {
        return this.audioService.volumeLevel;
    }
    
    get driving(): boolean {
        return this.carSetupService.getSetup().driving;
    }
    
    toggleFullscreen(): void {
        this.appService.toggleFullscreen();
    }
    
    toggleSoundLevel(): void {
        this.audioService.toggleVolumeLevel();
    }
}
