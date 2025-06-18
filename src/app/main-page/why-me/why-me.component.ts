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
  private autoSlideTimer = 4000; 

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
    this.setupLanguageSubscription();
  }

  ngOnInit(): void {
    this.updateTranslations();
    this.startAutoSlide();
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  private setupLanguageSubscription(): void {
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateTranslations();
    });
  }

  private updateTranslations(): void {
    const keys = this.extractTranslationKeys();
    this.applyTranslations(keys);
  }

  private extractTranslationKeys(): string[] {
    return this.locationSlides.flatMap(slide => [slide.titleKey, slide.subtitleKey]);
  }

  private applyTranslations(keys: string[]): void {
    this.translate.get(keys).subscribe(translations => {
      this.locationSlides.forEach(slide => this.updateSlideTranslations(slide, translations));
    });
  }

  private updateSlideTranslations(slide: LocationSlide, translations: any): void {
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
    this.playSlideSound();
  }

  private playSlideSound(): void {
  }

  private initializeAnimations(): void {
    if (!this.carouselContainer) return;

    const observer = this.createIntersectionObserver();
    const animatedElements = this.getAnimatedElements();
    this.observeElements(observer, animatedElements);
  }

  private createIntersectionObserver(): IntersectionObserver {
    return new IntersectionObserver(
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
  }

  private getAnimatedElements(): NodeListOf<Element> {
    return this.carouselContainer.nativeElement.querySelectorAll(
      '.location-carousel, .introduction-card, .talk-button'
    );
  }

  private observeElements(observer: IntersectionObserver, elements: NodeListOf<Element>): void {
    elements.forEach((el: Element) => observer.observe(el));
  }

  private cleanupSubscriptions(): void {
    this.stopAutoSlide();
    this.langChangeSub?.unsubscribe();
  }

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
}