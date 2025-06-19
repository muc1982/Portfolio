import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollBounceDirective } from '../../Instructions/scroll-bounce.directive';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TranslateModule } from "@ngx-translate/core";
import { Subscription, interval } from 'rxjs';

interface LocationSlide {
  icon: string;
  titleKey: string;
  subtitleKey: string;
  title: string;
  subtitle: string;
}

interface Particle {
  left: string;
  top: string;
  delay: string;
}

@Component({
  selector: 'app-why-me',
  standalone: true,
  imports: [CommonModule, ScrollBounceDirective, TranslateModule],
  templateUrl: './why-me.component.html',
  styleUrl: './why-me.component.scss'
})
export class WhyMeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef;
  @ViewChild('heroTextSection', { static: false }) heroTextSection!: ElementRef;
  @ViewChild('carouselContainerMobile', { static: false }) carouselContainerMobile!: ElementRef;
  @ViewChild('heroTextSectionMobile', { static: false }) heroTextSectionMobile!: ElementRef;

  currentSlideIndex = 0;
  private slideInterval?: Subscription;
  private langChangeSub?: Subscription;
  private autoSlideTimer = 4000;

  // Particles für Desktop - elegante Apple-Style Floating-Effekte
  particles: Particle[] = [
    { left: '10%', top: '20%', delay: '0s' },
    { left: '85%', top: '15%', delay: '1s' },
    { left: '90%', top: '70%', delay: '2s' },
    { left: '15%', top: '80%', delay: '3s' },
    { left: '75%', top: '40%', delay: '1.5s' },
    { left: '25%', top: '60%', delay: '2.5s' },
    { left: '60%', top: '10%', delay: '4s' },
    { left: '5%', top: '45%', delay: '3.5s' },
    { left: '95%', top: '90%', delay: '0.5s' },
    { left: '50%', top: '85%', delay: '2.2s' },
    { left: '40%', top: '25%', delay: '1.8s' },
    { left: '80%', top: '60%', delay: '3.2s' }
  ];

  // Particles für Mobile - reduziert und optimiert
  particlesMobile: Particle[] = [
    { left: '15%', top: '25%', delay: '0s' },
    { left: '80%', top: '20%', delay: '1.5s' },
    { left: '85%', top: '75%', delay: '2.5s' },
    { left: '20%', top: '80%', delay: '3s' },
    { left: '70%', top: '50%', delay: '1s' },
    { left: '30%', top: '60%', delay: '2s' },
    { left: '60%', top: '30%', delay: '2.8s' },
    { left: '10%', top: '55%', delay: '1.2s' }
  ];

  locationSlides: LocationSlide[] = [
    {
      icon: 'location.png',
      titleKey: 'intro.munich',
      subtitleKey: 'intro.munich.subtitle',
      title: 'Ich bin aus München verfügbar',
      subtitle: 'Vor Ort oder hybrid - flexibel für Ihr Projekt'
    },
    {
      icon: 'computer.png',
      titleKey: 'intro.remote',
      subtitleKey: 'intro.remote.subtitle',
      title: 'Ich arbeite remote bundesweit',
      subtitle: 'Moderne Zusammenarbeit ohne geografische Grenzen'
    },
    {
      icon: 'suitcase.png',
      titleKey: 'intro.relocate',
      subtitleKey: 'intro.relocate.subtitle',
      title: 'Ich bin bereit umzuziehen',
      subtitle: 'Für das richtige Projekt auch deutschlandweit'
    }
  ];

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.initializeLanguage();
    this.updateTranslations();
    this.startAutoSlide();
    this.generateDynamicParticles();
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
    this.observeHeroTextSection();
    this.setupIntersectionObservers();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  private initializeLanguage(): void {
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateTranslations();
    });
  }

  private generateDynamicParticles(): void {
    // Generiere zusätzliche Partikel basierend auf Bildschirmgröße
    const isDesktop = window.innerWidth > 899;
    const particleCount = isDesktop ? 15 : 10;

    const additionalParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      additionalParticles.push({
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 80 + 10}%`,
        delay: `${Math.random() * 5}s`
      });
    }

    if (isDesktop) {
      this.particles = [...this.particles, ...additionalParticles.slice(0, 8)];
    } else {
      this.particlesMobile = [...this.particlesMobile, ...additionalParticles.slice(0, 4)];
    }
  }

  private observeHeroTextSection(): void {
    if (!this.heroTextSection?.nativeElement && !this.heroTextSectionMobile?.nativeElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerHeroTextAnimation(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (this.heroTextSection?.nativeElement) {
      observer.observe(this.heroTextSection.nativeElement);
    }

    if (this.heroTextSectionMobile?.nativeElement) {
      observer.observe(this.heroTextSectionMobile.nativeElement);
    }
  }

  private setupIntersectionObservers(): void {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.triggerElementSpecificAnimation(entry.target);
        }
      });
    }, observerOptions);

    // Beobachte verschiedene Elemente für gestaffelte Animationen
    const elementsToObserve = [
      '.location-carousel',
      '.introduction-card',
      '.talk-button'
    ];

    elementsToObserve.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => observer.observe(el));
    });
  }

  private triggerElementSpecificAnimation(element: Element): void {
    if (element.classList.contains('location-carousel')) {
      this.animateLocationCarousel(element);
    } else if (element.classList.contains('introduction-card')) {
      this.animateIntroductionCard(element);
    } else if (element.classList.contains('talk-button')) {
      this.animateButton(element);
    }
  }

  private animateLocationCarousel(element: Element): void {
    // Zusätzliche Carousel-Animationen
    const dots = element.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      setTimeout(() => {
        dot.classList.add('pulse-animation');
      }, index * 200);
    });
  }

  private animateIntroductionCard(element: Element): void {
    // Card-spezifische Animationen
    const cardBackground = element.querySelector('.card-background');
    if (cardBackground) {
      cardBackground.classList.add('morph-active');
    }
  }

  private animateButton(element: Element): void {
    // Button-Glow-Effekt verstärken
    const buttonGlow = element.querySelector('.button-glow');
    if (buttonGlow) {
      buttonGlow.classList.add('glow-active');
    }
  }

  private triggerHeroTextAnimation(target: Element): void {
    target.classList.add('animate-in');

    // Gestaffelte Animation für Highlight-Wörter
    const highlightWords = target.querySelectorAll('.highlight-word');
    highlightWords.forEach((word, index) => {
      setTimeout(() => {
        word.classList.add('highlight-active');
      }, 1000 + (index * 300));
    });
  }

  private updateTranslations(): void {
    const keys = this.getTranslationKeys();
    this.applyTranslations(keys);
  }

  private getTranslationKeys(): string[] {
    return this.locationSlides.flatMap(slide => [slide.titleKey, slide.subtitleKey]);
  }

  private applyTranslations(keys: string[]): void {
    this.translate.get(keys).subscribe(translations => {
      this.locationSlides.forEach(slide => this.updateSlide(slide, translations));
    });
  }

  private updateSlide(slide: LocationSlide, translations: any): void {
    slide.title = translations[slide.titleKey] || slide.title;
    slide.subtitle = translations[slide.subtitleKey] || slide.subtitle;
  }

  private startAutoSlide(): void {
    this.slideInterval = interval(this.autoSlideTimer).subscribe(() => {
      this.nextSlide();
    });
  }

  private stopAutoSlide(): void {
    this.slideInterval?.unsubscribe();
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.locationSlides.length;
    this.triggerSlideAnimation();
  }

  goToSlide(index: number): void {
    if (index !== this.currentSlideIndex) {
      this.currentSlideIndex = index;
      this.triggerSlideAnimation();
      this.restartAutoSlide();
    }
  }

  private restartAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  private triggerSlideAnimation(): void {
    // Slide-spezifische Animationen
    const activeSlide = document.querySelector('.location-slide.active');
    if (activeSlide) {
      const icon = activeSlide.querySelector('.location-icon');
      if (icon) {
        icon.classList.add('slide-transition');
        setTimeout(() => {
          icon.classList.remove('slide-transition');
        }, 600);
      }
    }
  }

  private initializeAnimations(): void {
    if (!this.carouselContainer?.nativeElement) return;

    // Verzögerte Initialisierung für bessere Performance
    setTimeout(() => {
      this.setupAdvancedAnimations();
    }, 100);
  }

  private setupAdvancedAnimations(): void {
    // Erweiterte Animations-Logik
    const containers = [
      this.carouselContainer?.nativeElement,
      this.carouselContainerMobile?.nativeElement
    ].filter(Boolean);

    containers.forEach(container => {
      if (container) {
        container.classList.add('animations-ready');
      }
    });
  }

  private cleanupSubscriptions(): void {
    this.stopAutoSlide();
    this.langChangeSub?.unsubscribe();
  }

  // Public Getter Methods
  get currentSlide(): LocationSlide {
    return this.locationSlides[this.currentSlideIndex];
  }

  isSlideActive(index: number): boolean {
    return index === this.currentSlideIndex;
  }

  getDotClass(index: number): string {
    return this.isSlideActive(index) ? 'dot active' : 'dot';
  }

  getHighlightText(): string {
    const slide = this.currentSlide;
    const words = slide.title.split(' ');
    return words.slice(0, Math.ceil(words.length / 2)).join(' ');
  }

  getRegularText(): string {
    const slide = this.currentSlide;
    const words = slide.title.split(' ');
    return words.slice(Math.ceil(words.length / 2)).join(' ');
  }

  // Utility Methods - Responsive Particle Management
  getActiveParticles(): Particle[] {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 375) {
      return this.particlesMobile.slice(0, 4); // Minimal particles for smallest screens
    } else if (screenWidth <= 480) {
      return this.particlesMobile.slice(0, 6); // Reduced particles for small screens
    } else if (screenWidth <= 768) {
      return this.particlesMobile; // All mobile particles for tablets
    } else {
      return this.particles; // Full desktop particles
    }
  }

  private isScreenSizeMobile(): boolean {
    return window.innerWidth <= 768;
  }

  // Optional: Performance Optimierung
  onScroll(): void {
    // Throttled scroll handling für Performance
    const scrollY = window.scrollY;

    // Parallax-Effekte können hier implementiert werden
    requestAnimationFrame(() => {
      this.updateParallaxEffects(scrollY);
    });
  }

  private updateParallaxEffects(scrollY: number): void {
    // Implementierung für subtile Parallax-Effekte
    const heroSection = document.querySelector('.hero-text-section');
    if (heroSection) {
      const offset = scrollY * 0.1;
      (heroSection as HTMLElement).style.transform = `translateY(${offset}px)`;
    }
  }

  // Event Handlers
  onHeroTextHover(event: MouseEvent): void {
    // Optional: Zusätzliche Hover-Interaktionen
    const target = event.target as HTMLElement;
    if (target.classList.contains('highlight-word')) {
      target.classList.add('hover-active');
    }
  }

  onHeroTextLeave(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('highlight-word')) {
      target.classList.remove('hover-active');
    }
  }

  // Public Methods für Template
  onLocationIconClick(index: number): void {
    this.goToSlide(index);
    this.triggerIconClickAnimation(index);
  }

  private triggerIconClickAnimation(index: number): void {
    const icons = document.querySelectorAll('.location-icon');
    if (icons[index]) {
      icons[index].classList.add('click-animation');
      setTimeout(() => {
        icons[index].classList.remove('click-animation');
      }, 300);
    }
  }
}