import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AppService} from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild('app', {static: true}) element: ElementRef;
    
    constructor(private appService: AppService) {}
    
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
