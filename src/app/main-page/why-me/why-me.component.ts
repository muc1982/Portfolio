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

@Component({
  selector: 'app-why-me',
  standalone: true,
  imports: [CommonModule, ScrollBounceDirective, TranslateModule],
  templateUrl: './why-me.component.html',
  styleUrl: './why-me.component.scss'
})
export class WhyMeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef;

  currentSlideIndex = 0;
  private slideInterval?: Subscription;
  private langChangeSub?: Subscription;
  private autoSlideTimer = 4000; // 4 seconds

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

  constructor(private translate: TranslateService) {
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateTranslations();
    });
  }

  ngOnInit(): void {
    this.updateTranslations();
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    // Initialize intersection observer for entrance animations
    this.initializeAnimations();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    this.langChangeSub?.unsubscribe();
  }

  private updateTranslations(): void {
    const keys = this.locationSlides.flatMap(slide => [slide.titleKey, slide.subtitleKey]);
    
    this.translate.get(keys).subscribe(translations => {
      this.locationSlides.forEach(slide => {
        slide.title = translations[slide.titleKey] || slide.title;
        slide.subtitle = translations[slide.subtitleKey] || slide.subtitle;
      });
    });
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
      
      // Restart auto-slide timer
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }

  private triggerSlideAnimation(): void {
    // Add any additional slide transition logic here
    this.playSlideSound();
  }

  private playSlideSound(): void {
    // Optional: Add subtle sound effect for slide transitions
    // This would require Web Audio API implementation
  }

  private initializeAnimations(): void {
    if (!this.carouselContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe elements for scroll-triggered animations
    const animatedElements = this.carouselContainer.nativeElement.querySelectorAll(
      '.location-carousel, .introduction-card, .talk-button'
    );
    
    animatedElements.forEach((el: Element) => observer.observe(el));
  }

  // Getter for template use
  get currentSlide(): LocationSlide {
    return this.locationSlides[this.currentSlideIndex];
  }

  // Method to get slide state for template
  isSlideActive(index: number): boolean {
    return index === this.currentSlideIndex;
  }

  // Method for dot indicator state
  getDotClass(index: number): string {
    return this.isSlideActive(index) ? 'dot active' : 'dot';
  }

  // Enhanced typing effect methods
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
}