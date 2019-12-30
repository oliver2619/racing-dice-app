import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private static readonly PREFIX = 'RacingAppDice';
    
    constructor() {}

    load(key: string): any {
        const data = window.localStorage.getItem(`${SettingsService.PREFIX}:${key}`);
        return data !== null ? JSON.parse(data) : undefined;
    }

    save(key: string, value: any) {
        window.localStorage.setItem(`${SettingsService.PREFIX}:${key}`, JSON.stringify(value));
    }
}
