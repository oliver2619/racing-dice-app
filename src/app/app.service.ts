import { Injectable } from '@angular/core';
import { LocalStoreService } from './local-store.service';

interface AppSettingsJson {
	version: 1;
	raceDigital: boolean;
}

@Injectable()
export class AppService {

	private static readonly SETTINGS_KEY = 'app';

	private _element: HTMLElement;
	private _raceDigital = false;

	get fullscreen(): boolean {
		return document.fullscreenElement !== null;
	}

	get raceDigital(): boolean {
		return this._raceDigital;
	}

	constructor(private localStoreService: LocalStoreService) {
		const appSettings = <AppSettingsJson>this.localStoreService.load(AppService.SETTINGS_KEY);
		if (appSettings !== undefined) {
			this._raceDigital = appSettings.raceDigital;
		} else {
			this.save();
		}
		document.addEventListener('fullscreenchange', (ev: Event) => {
		});
	}

	registerFullScreenElement(element: HTMLElement): void {
		this._element = element;
	}

	setRaceDigital(digital: boolean): void {
		this._raceDigital = digital;
		this.save();
	}

	toggleFullscreen(): void {
		if (!this.fullscreen)
			this._element.requestFullscreen();
		else
			document.exitFullscreen();
	}

	private save(): void {
		const settings: AppSettingsJson = {
			raceDigital: this._raceDigital,
			version: 1
		};
		this.localStoreService.save(AppService.SETTINGS_KEY, settings);
	}
}
