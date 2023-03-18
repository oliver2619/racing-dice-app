import { Injectable } from '@angular/core';
import { LocalStoreService } from './local-store.service';

export enum GameMode {
  SINGLE_RACE, CHAMPIONSHIP
}

interface AppSettingsJson {
  version: 1;
  name?: string;
  mode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private static readonly SETTINGS_KEY = 'app';

  private _fullscreenElement: HTMLElement | undefined;
  private _name = 'Du';
  private _mode = GameMode.SINGLE_RACE;

  get fullscreen(): boolean { return document.fullscreenElement !== null; }

  get mode(): GameMode { return this._mode; }

  get name(): string { return this._name; }

  constructor(private localStoreService: LocalStoreService) {
    const appSettings = <AppSettingsJson>this.localStoreService.load(AppService.SETTINGS_KEY);
    if (appSettings !== undefined) {
      if (appSettings.name !== undefined) {
        this._name = appSettings.name;
      }
      if (appSettings.mode !== undefined) {
        this._mode = (GameMode as any)[appSettings.mode];
      }
    }
    document.addEventListener('fullscreenchange', _ => { });
  }

  registerFullScreenElement(element: HTMLElement): void { this._fullscreenElement = element; }

  setName(name: string) {
    this._name = name;
    this.save();
  }

  setMode(mode: GameMode) {
    this._mode = mode;
    this.save();
  }

  toggleFullscreen(): void {
    if (!this.fullscreen && this._fullscreenElement) {
      this._fullscreenElement.requestFullscreen();
    }
    else {
      document.exitFullscreen();
    }
  }

  private save(): void {
    const settings: AppSettingsJson = {
      version: 1,
      name: this._name,
      mode: GameMode[this._mode]
    };
    this.localStoreService.save(AppService.SETTINGS_KEY, settings);
  }
}
