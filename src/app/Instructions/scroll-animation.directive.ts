import { AfterViewInit, Directive, ElementRef, Renderer2, Input, OnDestroy } from "@angular/core";

interface ScrollAnimateOptions {
    animateCss?: string;
}

@Directive({
    selector: '[appScrollAnimate]',
    standalone: true
})
export class ScrollAnimateDirective implements AfterViewInit, OnDestroy {
    @Input('appScrollAnimate') options: ScrollAnimateOptions = {};
    
    private isVisible = false;  
    private observer?: IntersectionObserver;
    private animateCss = '';
    
    constructor(
        private readonly el: ElementRef<HTMLElement>, 
        private readonly renderer: Renderer2
    ) {}

    ngAfterViewInit(): void {
        this.animateCss = this.options.animateCss || '';
        if (!this.animateCss) return;
        
        this.initializeObserver();
    }

    private initializeObserver(): void {
        const options: IntersectionObserverInit = {
            threshold: 0.5,
            rootMargin: '0px 0px -10% 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            if (entry.isIntersecting && !this.isVisible) {
                this.isVisible = true;
                this.renderer.addClass(this.el.nativeElement, this.animateCss);
            } else if (!entry.isIntersecting && this.isVisible) {
                this.isVisible = false;
                this.renderer.removeClass(this.el.nativeElement, this.animateCss);
            }
        }, options);

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = undefined;
        }
    }
}