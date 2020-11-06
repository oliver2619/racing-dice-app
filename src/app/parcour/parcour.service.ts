import { Injectable } from '@angular/core';
import { Parcour, ParcourElement, ParcourJson } from '../model/parcour';
import { LocalStoreService } from '../local-store.service';

@Injectable({
	providedIn: 'root'
})
export class ParcourService {

	private static readonly STORE_KEY: string = 'parcour';

	readonly parcour = new Parcour();

	get elements(): ParcourElement[] {
		return this.parcour.elements;
	}

	get isEmpty(): boolean {
		return this.parcour.length < 2;
	}

	get length(): number {
		return this.parcour.length;
	}

	get rounds(): number {
		return this.parcour.rounds;
	}

	set rounds(rounds: number) {
		this.parcour.rounds = rounds;
		this.save();
	}

	constructor(private readonly localStoreService: LocalStoreService) {
		const json: ParcourJson = <ParcourJson>this.localStoreService.load(ParcourService.STORE_KEY);
		if (json !== undefined) {
			this.parcour.load(json);
		}
	}

	appendStraight(length: number): void {
		this.parcour.appendStraight(length);
		this.save();
	}

	appendCurve(length: number, curve: number): void {
		this.parcour.appendCurve(length, curve);
		this.save();
	}

	clear(): void {
		this.parcour.clear();
		this.save();
	}

	insert(index: number, element: ParcourElement): void {
		this.parcour.insert(index, element);
		this.save();
	}

	remove(index: number): void {
		this.parcour.remove(index);
		this.save();
	}

	replace(index: number, element: ParcourElement): void {
		this.parcour.replace(index, element);
		this.save();
	}

	private save(): void {
		const json = this.parcour.save();
		this.localStoreService.save(ParcourService.STORE_KEY, json);
	}
}
