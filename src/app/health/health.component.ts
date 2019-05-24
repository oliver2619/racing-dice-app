import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-health',
    templateUrl: './health.component.html',
    styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

    @Input()
    health: number;

    ngOnInit(): void {
        if (typeof this.health !== 'number')
            throw new Error('Attribute health of health component must be of type number');
    }

}
