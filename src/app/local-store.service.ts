import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  private static readonly PREFIX = 'RacingAppDice';

  constructor() { }

  load(key: string): { [key: string]: any } | undefined {
    const data = window.localStorage.getItem(`${LocalStoreService.PREFIX}:${key}`);
    return data !== null ? JSON.parse(data) : undefined;
  }

  save(key: string, data: { [key: string]: any }): void {
    window.localStorage.setItem(`${LocalStoreService.PREFIX}:${key}`, JSON.stringify(data));
  }
}
