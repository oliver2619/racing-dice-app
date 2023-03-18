import { Component } from '@angular/core';
import { AudioService } from '../audio.service';
import { AppService } from '../app.service';
import { CarSetupService } from '../car-setup/car-setup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

	formGroup: FormGroup;

	get name(): string {
		return this.appService.name;
	}

	get soundLevel(): number {
		return this.audioService.volumeLevel;
	}

	constructor(private audioService: AudioService, private appService: AppService, private carSetupService: CarSetupService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('name', formBuilder.control(this.appService.name, Validators.required));
	}

	setSoundLevel(level: number): void {
		this.audioService.setVolumeLevel(level);
	}

	onChangeName() {
		if (this.formGroup.valid) {
			this.appService.setName(this.formGroup.value['name']);
		}
	}
}
