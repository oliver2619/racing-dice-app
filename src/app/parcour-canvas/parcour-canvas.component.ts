import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({
	selector: 'app-parcour-canvas',
	templateUrl: './parcour-canvas.component.html',
	styleUrls: ['./parcour-canvas.component.scss']
})
export class ParcourCanvasComponent implements AfterViewInit, OnDestroy {

	@ViewChild('canvas', { static: true }) element: ElementRef<HTMLCanvasElement>;

	private static G3: HTMLImageElement | undefined;
	private static G4: HTMLImageElement | undefined;
	private static K1: HTMLImageElement | undefined;
	private static K2: HTMLImageElement | undefined;
	private static K3: HTMLImageElement | undefined;
	private static Z: HTMLImageElement | undefined;
	private static _imagesLoaded = 0;
	private static onImagesLoaded = new Subject<void>();
	private static unitX = 0;
	private static unitY = 0;

	private subscription: Subscription;
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	static get imagesLoaded(): boolean {
		return ParcourCanvasComponent._imagesLoaded === 6;
	}

	constructor() {
		ParcourCanvasComponent.loadImages();
	}

	onResize(): void {
		this.resize();
		this.repaint();
	}

	ngAfterViewInit(): void {
		this.canvas = this.element.nativeElement;
		this.context = this.canvas.getContext('2d', { alpha: false });
		this.resize();
		if (ParcourCanvasComponent.imagesLoaded) {
			this.repaint();
		} else {
			this.subscription = ParcourCanvasComponent.onImagesLoaded.subscribe({ next: () => this.repaint() });
		}
	}

	ngOnDestroy(): void {
		if (this.subscription !== undefined) {
			this.subscription.unsubscribe();
		}
	}

	private repaint(): void {
		this.context.save();
		this.context.translate(100, 100);
		this.context.scale(.75, .75);
		try {
			this.drawElement(ParcourCanvasComponent.Z, 0, 0, 1);
			this.drawElement(ParcourCanvasComponent.K3, 4.5, 0.5, 0);
			this.drawElement(ParcourCanvasComponent.G3, 5, 4.5, 0);
			this.drawElement(ParcourCanvasComponent.K2, 5, 8, 2);
			this.drawElement(ParcourCanvasComponent.K1, 9, 8, 1);
			this.drawElement(ParcourCanvasComponent.G4, 9, 4, 0);
			
			this.context.fillStyle = "white";
			this.context.fillRect(-10, -10, 20, 20);
		} finally {
			this.context.restore();
		}
	}

	private drawElement(image: HTMLImageElement, x: number, y: number, rotation: number): void {
		this.context.save();
		this.context.translate(x * ParcourCanvasComponent.unitX, y * ParcourCanvasComponent.unitY);
		this.context.rotate(Math.PI * rotation / 2);
		this.context.translate(-image.width / 2, -image.height / 2);
		this.context.drawImage(image, 0, 0);
		this.context.restore();
	}
	
	private resize(): void {
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
	}

	private static onLoadCallback = () => {
		++ParcourCanvasComponent._imagesLoaded;
		if (ParcourCanvasComponent.imagesLoaded) {
			ParcourCanvasComponent.unitX = ParcourCanvasComponent.G4.width / 4;
			ParcourCanvasComponent.unitY = ParcourCanvasComponent.G4.height / 4;
			ParcourCanvasComponent.onImagesLoaded.next();
		}
	};

	private static loadImages(): void {
		if (ParcourCanvasComponent.G3 === undefined) {
			ParcourCanvasComponent.G3 = new Image();
			ParcourCanvasComponent.G3.src = 'assets/images/g3.png';
			ParcourCanvasComponent.G3.onload = ParcourCanvasComponent.onLoadCallback;
		}
		if (ParcourCanvasComponent.G4 === undefined) {
			ParcourCanvasComponent.G4 = new Image();
			ParcourCanvasComponent.G4.src = 'assets/images/g4.png';
			ParcourCanvasComponent.G4.onload = ParcourCanvasComponent.onLoadCallback;
		}
		if (ParcourCanvasComponent.K1 === undefined) {
			ParcourCanvasComponent.K1 = new Image();
			ParcourCanvasComponent.K1.src = 'assets/images/k1.png';
			ParcourCanvasComponent.K1.onload = ParcourCanvasComponent.onLoadCallback;
		}
		if (ParcourCanvasComponent.K2 === undefined) {
			ParcourCanvasComponent.K2 = new Image();
			ParcourCanvasComponent.K2.src = 'assets/images/k2.png';
			ParcourCanvasComponent.K2.onload = ParcourCanvasComponent.onLoadCallback;
		}
		if (ParcourCanvasComponent.K3 === undefined) {
			ParcourCanvasComponent.K3 = new Image();
			ParcourCanvasComponent.K3.src = 'assets/images/k3.png';
			ParcourCanvasComponent.K3.onload = ParcourCanvasComponent.onLoadCallback;
		}
		if (ParcourCanvasComponent.Z === undefined) {
			ParcourCanvasComponent.Z = new Image();
			ParcourCanvasComponent.Z.src = 'assets/images/z.png';
			ParcourCanvasComponent.Z.onload = ParcourCanvasComponent.onLoadCallback;
		}
	}

}
