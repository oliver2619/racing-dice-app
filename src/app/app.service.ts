import {Injectable} from '@angular/core';

@Injectable()
export class AppService {
    private _element: HTMLElement;

    constructor() {
        document.addEventListener('fullscreenchange', (ev: Event) => {
        });
    }

    get fullscreen(): boolean {
        return document.fullscreenElement !== null;
    }

    registerFullScreenElement(element: HTMLElement): void {
        this._element = element;
    }

    toggleFullscreen(): void {
        if (!this.fullscreen)
            this._element.requestFullscreen();
        else
            document.exitFullscreen();
    }
}
