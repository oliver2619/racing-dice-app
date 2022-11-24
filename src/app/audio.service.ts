import { Injectable } from '@angular/core';
import { LocalStoreService } from 'src/app/local-store.service';


interface AudioSettingsJson {
	version: 1;
	volumeLevel: number;
}

@Injectable()
export class AudioService {

	private static readonly SETTINGS_KEY = 'audio';

	private _click = AudioService.newAudio('click');
	private _crash = AudioService.newAudio('crash');
	private _horn: HTMLAudioElement[] = [
		AudioService.newAudio('horn1'),
		AudioService.newAudio('horn2'),
		AudioService.newAudio('horn3'),
		AudioService.newAudio('horn4'),
		AudioService.newAudio('horn5'),
		AudioService.newAudio('horn6'),
	];
	private _motorFailure = AudioService.newAudio('motor');
	private _tireFailure1 = AudioService.newAudio('squealing1');
	private _tireFailure2 = AudioService.newAudio('squealing2');

	private _hornPlayed = false;
	private _clickPlayed = false;
	private _volumeLevel = 1;

	get hornPlayed(): boolean {
		return this._hornPlayed;
	}

	get volumeLevel(): number {
		return this._volumeLevel;
	}

	constructor(private localStoreService: LocalStoreService) {
		this._horn.forEach(h => h.addEventListener('ended', (ev: MediaStreamErrorEvent) => this._hornPlayed = false));
		this._click.addEventListener('ended', (ev: MediaStreamErrorEvent) => this._clickPlayed = false);
		const audioSettings = <AudioSettingsJson>this.localStoreService.load(AudioService.SETTINGS_KEY);
		if (audioSettings !== undefined) {
			this._volumeLevel = audioSettings.volumeLevel;
		} else {
			this.saveSettings();
		}
	}

	click(): void {
		if (this._volumeLevel > 1) {
			if (this._clickPlayed) {
				this._click.currentTime = 0;
			} else {
				this._click.play();
				this._clickPlayed = true;
			}
		}
	}

	crash(): void {
		if (this._volumeLevel > 0)
			this._crash.play();
	}

	horn(team: number): void {
		if (this._volumeLevel > 0 && !this._hornPlayed) {
			this._horn[team].play();
			this._hornPlayed = true;
		}
	}

	motorFailure(strong: boolean): void {
		if (this._volumeLevel > 0)
			this._motorFailure.play();
	}

	tireFailure(strong: boolean): void {
		if (this._volumeLevel > 0) {
			if (strong)
				this._tireFailure2.play();
			else
				this._tireFailure1.play();
		}
	}

	setVolumeLevel(level: number): void {
		if (level >= 0 && level < 3) {
			this._volumeLevel = level;
			this.saveSettings();
		}
	}

	private static newAudio(name: string): HTMLAudioElement {
		return new Audio(`assets/sounds/${name}.mp3`);
	}

	private saveSettings(): void {
		const settings: AudioSettingsJson = {
			version: 1,
			volumeLevel: this._volumeLevel
		};
		this.localStoreService.save(AudioService.SETTINGS_KEY, settings);
	}
}
