import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
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
    LangSwitcherComponent
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
    // Sicherstellen dass Body-Scroll wiederhergestellt wird
    this.forceResetMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustViewport();
    
    // WICHTIG: Bei Resize immer Menu zurücksetzen und Body-Scroll wiederherstellen
    if (this.showMenu) {
      this.forceResetMenu();
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
    // Scroll-Event nur verarbeiten wenn Menu offen ist
    if (!this.showMenu) return;
    
    // Bei starkem Scroll das Menu schließen
    const currentScroll = window.pageYOffset;
    if (Math.abs(currentScroll - this.scrollPosition) > 100) {
      this.forceResetMenu();
    }
  }

  // KORRIGIERTE toggleMenu Methode mit Reset-Logik
  toggleMenu(): void {
    console.log('Toggle Menu - Current state:', this.showMenu);
    
    if (this.showMenu) {
      this.forceResetMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu(): void {
    console.log('Opening Menu');
    this.showMenu = true;
    this.lockBodyScroll();
  }

  // PUBLIC - wird vom Template aufgerufen
  closeMenu(): void {
    console.log('Closing Menu');
    this.showMenu = false;
    this.restoreBodyScroll();
  }

  // NEUE Methode: Komplettes Menu-Reset bei Problemen
  private forceResetMenu(): void {
    console.log('Force Reset Menu');
    this.showMenu = false;
    this.restoreBodyScroll();
    
    // Zusätzlicher Reset für hartnäckige Fälle
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    }, 50);
  }

  private lockBodyScroll(): void {
    this.scrollPosition = window.pageYOffset;
    console.log('Locking body scroll at position:', this.scrollPosition);
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
  }

  private restoreBodyScroll(): void {
    console.log('Restoring body scroll to position:', this.scrollPosition);
    
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Scroll-Position wiederherstellen
    if (this.scrollPosition > 0) {
      window.scrollTo(0, this.scrollPosition);
    }
  }

  // KORRIGIERTE scrollTo Methode - sauberes Menu-Management
  scrollTo(sectionId: string): void {
    console.log('ScrollTo called:', sectionId);
    
    // Menu komplett zurücksetzen
    this.forceResetMenu();
    
    // Kurze Verzögerung für sauberen Übergang
    setTimeout(() => {
      this.performScrollToSection(sectionId);
    }, 100);
  }

  private performScrollToSection(sectionId: string): void {
    // Mobile-spezifische IDs verwenden falls vorhanden
    let targetId = sectionId;
    
    // Prüfe ob mobile Version existiert
    if (sectionId === 'my-skills') {
      const mobileElement = document.getElementById('my-skills-mobile');
      if (mobileElement) {
        targetId = 'my-skills-mobile';
      }
    } else if (sectionId === 'my-projects') {
      const mobileElement = document.getElementById('my-projects-mobile');
      if (mobileElement) {
        targetId = 'my-projects-mobile';
      }
    } else if (sectionId === 'contact-me') {
      const mobileElement = document.getElementById('contact-me-mobile');
      if (mobileElement) {
        targetId = 'contact-me-mobile';
      }
    }

    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 72; // Mobile Header Höhe
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Scroll-Position für den Event-Handler aktualisieren
      this.scrollPosition = window.pageYOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Nach dem Scrollen die Position aktualisieren
      setTimeout(() => {
        this.scrollPosition = window.pageYOffset;
      }, 1000);
    } else {
      console.warn(`Element with ID '${targetId}' not found`);
    }
  }

  // Für eventuelle zukünftige Erweiterungen
  onMenuItemClick(sectionId: string): void {
    this.scrollTo(sectionId);
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
}