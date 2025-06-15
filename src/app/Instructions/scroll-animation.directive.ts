import { AfterViewInit, Directive, ElementRef, Renderer2, Input, OnDestroy } from "@angular/core";

interface ScrollAnimateOptions {
    animateCss?: string;
    delay?: number; 
    threshold?: number;
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
    private animationDelay = 200; 
    private threshold = 0.3; 
    
    constructor(
        private readonly el: ElementRef<HTMLElement>, 
        private readonly renderer: Renderer2
    ) {}

    ngAfterViewInit(): void {
        this.animateCss = this.options.animateCss || '';
        this.animationDelay = this.options.delay || 200;
        this.threshold = this.options.threshold || 0.3;
        
        if (!this.animateCss) return;
        
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transition', 'opacity 0.3s ease');
        
        this.initializeObserver();
    }

    private initializeObserver(): void {
        const options: IntersectionObserverInit = {
            threshold: this.threshold,
            rootMargin: '0px 0px -50px 0px' 
        };

        this.observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            if (entry.isIntersecting && !this.isVisible) {
                this.isVisible = true;
                
                setTimeout(() => {
                    this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
                    this.renderer.addClass(this.el.nativeElement, this.animateCss);
                }, this.animationDelay);
            } else if (!entry.isIntersecting && this.isVisible) {
                this.isVisible = false;
                this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
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
