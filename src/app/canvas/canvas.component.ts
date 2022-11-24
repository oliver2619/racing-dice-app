import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Team } from '../model/teams';
import { TeamService, TeamSelectionChangeObserver } from '../team-select/team.service';

@Component({
	selector: 'app-canvas',
	templateUrl: './canvas.component.html',
	styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnDestroy {

	@ViewChild('canvas')
	element: ElementRef<HTMLCanvasElement> | undefined;

	private canvas: HTMLCanvasElement | undefined;
	private context: CanvasRenderingContext2D | undefined;
	private pattern: CanvasPattern | undefined;
	private callback: TeamSelectionChangeObserver = () => this.repaint();
	private resizeCallback = () => {
		this.resize();
		this.repaint();
	};

	get backgroundColor(): string {
		switch (this.teamService.team) {
			case Team.YELLOW:
				return 'rgb(255,212,0)';
			case Team.RED:
				return 'rgb(255,61,61)';
			case Team.GREEN:
				return 'rgb(76,196,60)';
			case Team.BLUE:
				return 'rgb(53,56,227)';
			case Team.VIOLET:
				return 'rgb(109,49,170)';
			case Team.BLACK:
				return 'rgb(80,80,80)';
			default:
				return 'rgb(128,128,128)';
		}
	}

	get backgroundOperation(): GlobalCompositeOperation {
		switch (this.teamService.team) {
			case Team.YELLOW:
				return 'color';
			case Team.RED:
				return 'multiply';
			case Team.GREEN:
				return 'multiply';
			case Team.BLUE:
				return 'multiply';
			case Team.VIOLET:
				return 'multiply';
			case Team.BLACK:
				return 'multiply';
			default:
				return 'overlay';
		}
	}

	constructor(private readonly teamService: TeamService) {
		window.addEventListener('resize', this.resizeCallback);
	}

	ngOnDestroy(): void {
		this.teamService.removeTeamSelectionEvent(this.callback);
		window.removeEventListener('resize', this.resizeCallback);
	}

	ngOnInit(): void {
		this.teamService.addTeamSelectionEvent(this.callback);
		this.canvas = this.element?.nativeElement;
		this.context = this.canvas?.getContext('2d') ?? undefined;
		this.resize();
		const image: HTMLImageElement = new Image();
		image.src = 'assets/alu.jpg';
		image.onload = (ev: Event) => {
			this.pattern = this.context?.createPattern(image, 'repeat') ?? undefined;
			this.repaint();
		};
	}

	private resize(): void {
		if (this.canvas !== undefined) {
			this.canvas.width = this.canvas.clientWidth;
			this.canvas.height = this.canvas.clientHeight;
		}
	}

	private repaint(): void {
		if (this.context !== undefined && this.canvas !== undefined && this.pattern !== undefined && this.backgroundOperation !== undefined) {
			this.context.save();
			this.context.fillStyle = this.pattern;
			this.context.globalCompositeOperation = 'source-over';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.globalCompositeOperation = this.backgroundOperation;
			this.context.fillStyle = this.backgroundColor;
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.globalCompositeOperation = 'lighter';
			this.context.fillStyle = 'black';
			this.context.shadowColor = 'white';
			this.context.shadowBlur = 5;
			this.context.strokeRect(-1, -1, this.canvas.width + 2, this.canvas.height + 2);
			this.context.shadowBlur = 10;
			this.context.strokeRect(-1, -1, this.canvas.width + 2, this.canvas.height + 2);
			this.context.shadowBlur = 20;
			this.context.strokeRect(-1, -1, this.canvas.width + 2, this.canvas.height + 2);
			this.context.restore();
		}
	}
}
