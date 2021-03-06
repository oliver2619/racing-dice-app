import {Directive, ElementRef} from '@angular/core';
import {AudioService} from './audio.service';

@Directive({
    selector: 'button'
})
export class ButtonDirective {

    private button: HTMLButtonElement;

    constructor(el: ElementRef, audioService: AudioService) {
        this.button = el.nativeElement;
        
        this.button.addEventListener('mousedown', (ev: MouseEvent) => {
            const cl = this.button.classList;
            if (cl.contains('checked') || cl.contains('disabled') || cl.contains('silent'))
                return;
            audioService.click();
        });
    }
}
