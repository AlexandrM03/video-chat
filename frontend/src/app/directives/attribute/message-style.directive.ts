import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appMessageStyle]',
    standalone: true
})
export class MessageStyleDirective implements OnInit {
    @Input('appMessageStyle') condition: boolean;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        if (this.condition) {
            this.el.nativeElement.classList.add('bg-blue-500', 'text-white', 'rounded-tl-lg', 'rounded-bl-lg');
            this.el.nativeElement.classList.remove('bg-gray-200', 'rounded-tr-lg', 'rounded-br-lg');
        } else {
            this.el.nativeElement.classList.add('bg-gray-200', 'rounded-tr-lg', 'rounded-br-lg');
            this.el.nativeElement.classList.remove('bg-blue-500', 'text-white', 'rounded-tl-lg', 'rounded-bl-lg');
        }
    }
}
