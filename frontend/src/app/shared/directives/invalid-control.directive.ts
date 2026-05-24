import { Directive, DoCheck, ElementRef, Input, Renderer2, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appInvalidControl]'
})
export class InvalidControlDirective implements DoCheck {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private readonly renderer = inject(Renderer2);

  @Input({ required: true }) control!: AbstractControl;

  ngDoCheck(): void {
    if (!this.control) {
      return;
    }

    const isInvalid = this.control.invalid && (this.control.touched || this.control.dirty);

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'border-color',
      isInvalid ? '#dc2626' : '#94a3b8'
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-color',
      isInvalid ? '#fff1f2' : '#ffffff'
    );
  }
}
