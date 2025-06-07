import { AfterViewInit, Directive, ElementRef, Renderer2, Input, OnDestroy } from "@angular/core";

interface ScrollAnimateOptions {
    animateCss?: string;
}

@Directive({
    selector: '[appScrollAnimate]',
    standalone: true,
    exportAs: '[appScrollAnimate]',
})
export class ScrollAnimateDirective implements AfterViewInit, OnDestroy {
    @Input('appScrollAnimate') options: ScrollAnimateOptions = {};
    private isVisible = false;  
    private observer?: IntersectionObserver;
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit() {
        const animateCss = this.options.animateCss || '';
        
        this.observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && !this.isVisible) {
                    this.isVisible = true;
                    this.renderer.addClass(this.el.nativeElement, animateCss);
                } else {
                    this.isVisible = false;
                    this.renderer.removeClass(this.el.nativeElement, animateCss);
                }
            }
        }, { threshold: [.5] });

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = undefined;
        }
    }
}