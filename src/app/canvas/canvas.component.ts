import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {CarSetupService, TeamSelectionChangeObserver} from '../car-setup/car-setup.service';
import {Team} from '../model/teams';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {

    @ViewChild('canvas', {static: true}) element: ElementRef;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private pattern: CanvasPattern;
    private callback: TeamSelectionChangeObserver = t => this.repaint();

    get backgroundColor(): string {
        switch (this.carSetupService.team) {
            case Team.YELLOW:
                return 'rgb(255,212,0)';
            case Team.RED:
                return 'rgb(255,61,61)';
            case Team.GREEN:
                return 'rgb(76,196,60)';
            case Team.BLUE:
                return 'rgb(0,3,183)';
            case Team.VIOLET:
                return 'rgb(175,96,255)';
            case Team.BLACK:
            default:
                return 'rgb(128,128,128)';
        }
    }

    get backgroundOperation(): string {
        switch (this.carSetupService.team) {
            case Team.YELLOW:
                return 'overlay';
            case Team.RED:
                return 'multiply';
            case Team.GREEN:
                return 'multiply';
            case Team.BLUE:
                return 'overlay';
            case Team.VIOLET:
                return 'multiply';
            case Team.BLACK:
            default:
                return 'overlay';
        }
    }

    constructor(private carSetupService: CarSetupService) {
        window.addEventListener('resize', (ev: UIEvent) => {
            this.resize();
            this.repaint();
        });
    }

    ngOnDestroy(): void {
        this.carSetupService.removeTeamSelectionEvent(this.callback);
    }

    ngOnInit(): void {
        this.carSetupService.addTeamSelectionEvent(this.callback);
        this.canvas = this.element.nativeElement;
        this.context = this.canvas.getContext('2d');
        this.resize();
        const image: HTMLImageElement = new Image();
        image.src = 'assets/alu.jpg';
        image.onload = (ev: Event) => {
            this.pattern = this.context.createPattern(image, 'repeat');
            this.repaint();
        };
    }

    private resize(): void {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    private repaint(): void {
        this.context.fillStyle = this.pattern;
        this.context.globalCompositeOperation = 'source-over';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.globalCompositeOperation = this.backgroundOperation;
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

}
