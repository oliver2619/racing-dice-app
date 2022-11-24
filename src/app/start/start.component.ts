import { Component } from '@angular/core';
import json from '../../../package.json';

@Component({
	selector: 'app-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss']
})
export class StartComponent {

	get version(): string { return json.version; }
}
