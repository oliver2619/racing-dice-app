import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-number',
    templateUrl: './number-display-value.component.html',
    styleUrls: ['./number-display-value.component.scss']
})
export class NumberDisplayValueComponent {

    @Input()
    value: number | undefined;

    @Input()
    decimals: number | undefined;

    @Input()
    max: number | undefined;

    @Input()
    thresholds: number[] | undefined;
    
    @Input()
    width: number | undefined;

    get isCritical(): boolean {
        return this.thresholds !== undefined && this.thresholds.length > 0 && this.value !== undefined && this.value <= this.thresholds[0];
    }

    get isWarn(): boolean {
        return this.thresholds !== undefined && this.thresholds.length > 1 && this.value !== undefined && this.value <= this.thresholds[1] && this.value > this.thresholds[0];
    }
    
    get pipeString(): string {
        return this.decimals !== undefined ? `1.${this.decimals}-${this.decimals}` : '1.1-1';
    }

    get style(): any {
        const ret: {[key: string]: string} = {};
        if (this.width !== undefined) {
            ret['width'] = `${this.width}ch`;
        }
        return ret;
    }
    
    constructor() {}

}
