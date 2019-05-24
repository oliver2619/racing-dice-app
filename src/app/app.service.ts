import {Injectable} from '@angular/core';

@Injectable()
export class AppService {
    private _element: HTMLElement;

    constructor() {
        document.addEventListener('webkitfullscreenchange', (ev: Event) => {
        });
    }

    get fullscreen(): boolean {
        return document.webkitFullscreenElement !== null;
    }

    registerFullScreenElement(element: HTMLElement): void {
        this._element = element;
    }

    toggleFullscreen(): void {
        if (!this.fullscreen)
            this._element.webkitRequestFullscreen();
        else
            document.webkitExitFullscreen();
    }
}
