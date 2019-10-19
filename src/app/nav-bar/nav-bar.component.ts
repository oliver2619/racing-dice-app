import {Component, ViewChild} from '@angular/core';
import {AppService} from '../app.service';
import {AudioService} from '../audio.service';
import {CarSetupService} from '../car-setup/car-setup.service';
import {DialogComponent} from 'src/app/dialog/dialog.component';
import {version} from '../../../package.json';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

    @ViewChild(DialogComponent, {static: true})
    aboutDialog: DialogComponent;

    constructor(private appService: AppService, private audioService: AudioService, private carSetupService: CarSetupService) {}

    get driving(): boolean {return this.carSetupService.getSetup().driving;}

    get fullscreen(): boolean {return this.appService.fullscreen;}

    get soundLevel(): number {return this.audioService.volumeLevel;}

    get version(): string {return version;}

    toggleFullscreen(): void {
        this.appService.toggleFullscreen();
    }

    toggleSoundLevel(): void {
        this.audioService.toggleVolumeLevel();
    }

    showAbout(): void {
        this.aboutDialog.show();
    }
}
