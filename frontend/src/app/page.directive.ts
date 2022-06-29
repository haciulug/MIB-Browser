import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPage]'
})
export class PageDirective {

  constructor(elem: ElementRef, renderer:Renderer2) {
    let page = renderer.createText('PAGE');
    renderer.appendChild(elem.nativeElement, page);
   }

}
