import { AfterViewInit, Directive, ElementRef, Renderer2, Input, OnDestroy } from "@angular/core";

interface ScrollAnimateOptions {
    animateCss?: string;
    delay?: number; 
    threshold?: number;
    animationType?: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp';
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
    private animationDelay = 100; // Checkliste konform: 100ms
    private threshold = 0.1; // Niedrigere Schwelle für frühere Animation
    private animationType: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' = 'fade';
    
    constructor(
        private readonly el: ElementRef<HTMLElement>, 
        private readonly renderer: Renderer2
    ) {}

    ngAfterViewInit(): void {
        this.animateCss = this.options.animateCss || 'scroll-fade-in';
        this.animationDelay = this.options.delay || 100;
        this.threshold = this.options.threshold || 0.1;
        this.animationType = this.options.animationType || 'fade';
        
        // Initiale Sichtbarkeit verbergen
        this.renderer.addClass(this.el.nativeElement, 'scroll-hidden');
        
        this.initializeObserver();
    }

    private initializeObserver(): void {
        const options: IntersectionObserverInit = {
            threshold: this.threshold,
            rootMargin: '0px 0px -20px 0px' // Frühere Aktivierung
        };

        this.observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            if (entry.isIntersecting && !this.isVisible) {
                this.isVisible = true;
                
                setTimeout(() => {
                    this.renderer.removeClass(this.el.nativeElement, 'scroll-hidden');
                    this.renderer.addClass(this.el.nativeElement, 'scroll-visible');
                    
                    // Dezente Animation basierend auf Typ
                    switch (this.animationType) {
                        case 'slideLeft':
                            this.renderer.addClass(this.el.nativeElement, 'scroll-fade-in-left');
                            break;
                        case 'slideRight':
                            this.renderer.addClass(this.el.nativeElement, 'scroll-fade-in-right');
                            break;
                        default:
                            this.renderer.addClass(this.el.nativeElement, 'scroll-fade-in');
                    }
                }, this.animationDelay);
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
