import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScrollBounceDirective } from '../../Instructions/scroll-bounce.directive';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';

interface SlideContent {
  mainTextKey: string;
  subTextKey: string;
}

@Component({
  selector: 'app-why-me',
  standalone: true,
  imports: [ScrollBounceDirective, TranslateModule, CommonModule], // Fügen Sie TranslateModule und CommonModule hinzu
  templateUrl: './why-me.component.html',
  styleUrl: './why-me.component.scss'
})
export class WhyMeComponent implements OnInit, OnDestroy {
  private intervalSubscription?: Subscription;
  private languageSubscription?: Subscription;

  // Text-Inhalte für die Slides
  private slideContents: SlideContent[] = [
    {
      mainTextKey: 'intro.munich',
      subTextKey: 'intro.munich.subtitle'
    },
    {
      mainTextKey: 'intro.remote',
      subTextKey: 'intro.remote.subtitle'
    },
    {
      mainTextKey: 'intro.relocate',
      subTextKey: 'intro.relocate.subtitle'
    }
  ];

  // Aktuelle Slide-Daten
  currentSlideIndex = 0;
  currentMainText = '';
  currentSubText = '';
  nextMainText = '';
  nextSubText = '';

  // Animation States
  isTransitioning = false;
  showCurrentText = true;

  // Timing-Konfiguration
  private readonly SLIDE_DURATION = 4000; // 4 Sekunden pro Slide
  private readonly TRANSITION_DURATION = 800; // 0.8 Sekunden für den Übergang

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    // Initiale Texte laden
    this.loadCurrentTexts();

    // Language Change Subscription
    this.languageSubscription = this.translateService.onLangChange.subscribe(() => {
      this.loadCurrentTexts();
    });

    // Auto-Slide Timer starten
    this.startSlideTimer();
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private startSlideTimer(): void {
    this.intervalSubscription = interval(this.SLIDE_DURATION).subscribe(() => {
      this.nextSlide();
    });
  }

  private loadCurrentTexts(): void {
    const currentSlide = this.slideContents[this.currentSlideIndex];
    this.currentMainText = this.translateService.instant(currentSlide.mainTextKey);
    this.currentSubText = this.translateService.instant(currentSlide.subTextKey);
  }

  private loadNextTexts(): void {
    const nextIndex = (this.currentSlideIndex + 1) % this.slideContents.length;
    const nextSlide = this.slideContents[nextIndex];
    this.nextMainText = this.translateService.instant(nextSlide.mainTextKey);
    this.nextSubText = this.translateService.instant(nextSlide.subTextKey);
  }

  private nextSlide(): void {
    if (this.isTransitioning) return;

    // Nächste Texte vorbereiten
    this.loadNextTexts();

    // Nach halber Transition-Zeit die Texte wechseln
    setTimeout(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slideContents.length;
      this.currentMainText = this.nextMainText;
      this.currentSubText = this.nextSubText;
      this.showCurrentText = true;
    }, this.TRANSITION_DURATION / 2);

    // Transition beenden
    setTimeout(() => {
      this.isTransitioning = false;
    }, this.TRANSITION_DURATION);
  }

  // Public Methode für manuelle Navigation (optional)
  public goToSlide(index: number): void {
    if (index === this.currentSlideIndex || this.isTransitioning) return;

    this.currentSlideIndex = index;
    this.loadCurrentTexts();

    // Timer zurücksetzen
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    this.startSlideTimer();
  }

  // Getter für Template
  get slideIndicators(): number[] {
    return Array.from({ length: this.slideContents.length }, (_, i) => i);
  }
}

