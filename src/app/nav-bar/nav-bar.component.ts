import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

    constructor() {}

    get fullscreen(): boolean {
        return document.webkitFullscreenElement !== null;
    }

    toggleFullscreen(): void {
        if (!this.fullscreen)
            document.getElementById('app').webkitRequestFullscreen();
        else
            document.webkitExitFullscreen();
        window.setTimeout(()=>{}, 100);
    }

    ngOnInit() {
    }
}
