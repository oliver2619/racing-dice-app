import { Directive, HostListener } from '@angular/core';
import { AudioService } from './audio.service';

@Directive({
  selector: 'input[type=text]'
})
export class InputDirective {

  constructor(private readonly audioService: AudioService) { }

  @HostListener('input')
  onInput() {
    this.audioService.click();
  }
}
