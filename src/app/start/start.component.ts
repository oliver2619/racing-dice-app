import { Component } from '@angular/core';
import { version } from '../../../package.json';

@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.css']
})
export class StartComponent {

	get version(): string { return version; }
}
