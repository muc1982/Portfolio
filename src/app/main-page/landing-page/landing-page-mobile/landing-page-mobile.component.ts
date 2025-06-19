import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ScrollBounceDirective } from '../../../Instructions/scroll-bounce.directive';
import { LangSwitcherComponent } from '../../../shared/lang-switcher/lang-switcher.component';
import { NgStyle, NgIf } from '@angular/common';

@Component({
  selector: 'app-landing-page-mobile',
  standalone: true,
  templateUrl: './landing-page-mobile.component.html',
  styleUrls: ['./landing-page-mobile.component.scss'],
  imports: [
    TranslateModule,
    NgIf,
    LangSwitcherComponent,
    ScrollBounceDirective 
  ]
})
export class LandingPageMobileComponent implements AfterViewInit, OnDestroy {
  @ViewChild('logoImg') logoImgRef!: ElementRef;
  showMenu = false;
  private scrollPosition = 0;

  constructor(private translate: TranslateService) {}

  ngAfterViewInit(): void {
    this.adjustViewport();
  }

  ngOnDestroy(): void {
    if (this.showMenu) {
      this.restoreBodyScroll();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustViewport();
    
    // Menü bei Desktop-Größe automatisch schließen
    if (this.showMenu && window.innerWidth > 768) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showMenu) {
      this.closeMenu();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Menü schließen beim Scrollen für bessere UX
    if (this.showMenu && Math.abs(window.scrollY - this.scrollPosition) > 50) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    if (this.showMenu) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu(): void {
    this.showMenu = true;
    this.lockBodyScroll();
  }

  private closeMenu(): void {
    this.showMenu = false;
    this.restoreBodyScroll();
  }

  private lockBodyScroll(): void {
    this.scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
  }

  private restoreBodyScroll(): void {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, this.scrollPosition);
  }

  // Methode um zu verschiedenen Sektionen zu scrollen
  scrollToSection(sectionId: string): void {
    this.closeMenu();
    
    // Kurze Verzögerung für Animation
    setTimeout(() => {
      this.performScrollToSection(sectionId);
    }, 300);
  }

  private performScrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 104; // Gleicher Offset wie in der Hauptnavigation
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Original scrollTo Methode für Template-Kompatibilität
  scrollTo(sectionId: string): void {
    this.scrollToSection(sectionId);
  }

  private adjustViewport(): void {
    // Viewport-Höhe für mobile Browser mit Address Bar
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    // Zoom-Verhinderung bei Doppel-Tap auf Burger-Button
    const target = event.target as HTMLElement;
    if (target?.closest('.burger-menu-btn')) {
      event.preventDefault();
    }
  }

  // Für eventuelle zukünftige Erweiterungen
  onMenuItemClick(sectionId: string): void {
    this.scrollToSection(sectionId);
  }
}