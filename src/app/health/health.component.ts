import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-health',
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.scss']
})
export class HealthComponent {

    @Input()
    health: number = 0;
}
