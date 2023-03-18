import { Directive, ElementRef, HostListener } from '@angular/core';
import { AudioService } from './audio.service';

@Directive({
  selector: 'button'
})
export class ButtonDirective {

  private readonly button: HTMLButtonElement;

  constructor(el: ElementRef<HTMLButtonElement>, private readonly audioService: AudioService) {
    this.button = el.nativeElement;
  }

  @HostListener('mousedown')
  onMouseDown() {
    const cl = this.button.classList;
    if (cl.contains('checked') || cl.contains('disabled') || cl.contains('silent'))
      return;
    this.audioService.click();
  }
}
