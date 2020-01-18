import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AppService} from './app.service';
import {CarSetupService} from 'src/app/car-setup/car-setup.service';
import {Team} from 'src/app/model/teams';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('app', {static: true}) element: ElementRef;

    get team(): string {
        return Team[this.carSetupService.team].toLowerCase();
    }
    
    constructor(private appService: AppService, private carSetupService: CarSetupService) {}

    ngOnInit(): void {
        document.addEventListener("contextmenu", (ev: PointerEvent) => {
            ev.preventDefault();
        });
        document.addEventListener("selectstart", (ev: Event) => {
            ev.preventDefault();
        });
        this.appService.registerFullScreenElement(this.element.nativeElement);
    }

}
