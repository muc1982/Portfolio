import { Directive, HostListener, inject, Input } from '@angular/core';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { GlobalService } from '../global.service';

gsap.registerPlugin(ScrollToPlugin);

@Directive({
  selector: '[appScrollBounce]',
  standalone: true,
  exportAs: 'appScrollBounce'
})
export class ScrollBounceDirective {
  @Input('appScrollBounce') targetId!: string;
  @Input('offsetY') offsetY: number = 120; // Standard Offset für Header
  private gs = inject(GlobalService);

  // KORRIGIERT: Event-Parameter hinzugefügt
  @HostListener('click', ['$event'])
  onClick(event?: Event) {
    // Verhindert Standard-Link-Verhalten wenn Event vorhanden
    if (event) {
      event.preventDefault();
    }
    
    const target = this.findTarget();
    if (!target) {
      console.warn(`Target element with ID "${this.targetId}" not found`);
      return;
    }
    
    this.gs.lastTargetId = this.targetId;
    this.smoothScrollTo(target);
  }

  // KORRIGIERT: Verbesserte Target-Suche mit Mobile-Fallbacks
  private findTarget(): HTMLElement | null {
    let target = document.getElementById(this.targetId);
    
    // Fallback für Mobile-Versionen
    if (!target && !this.targetId.includes('-mobile')) {
      target = document.getElementById(this.targetId + '-mobile');
    }
    
    // Fallback für Desktop-Versionen  
    if (!target && this.targetId.includes('-mobile')) {
      target = document.getElementById(this.targetId.replace('-mobile', ''));
    }
    
    // Weitere Fallbacks für verschiedene Namenskonventionen
    if (!target) {
      // Versuche mit verschiedenen Präfixen/Suffixen
      const variations = [
        this.targetId.replace('my-', ''),
        this.targetId.replace('-me', ''),
        'section-' + this.targetId,
        this.targetId + '-section'
      ];
      
      for (const variation of variations) {
        target = document.getElementById(variation);
        if (target) break;
      }
    }
    
    return target;
  }

  // KORRIGIERT: Responsive Offset-Berechnung basierend auf tatsächlicher Header-Höhe
  private getResponsiveOffset(): number {
    const screenWidth = window.innerWidth;
    let baseOffset = this.offsetY;
    
    // Dynamische Header-Höhe ermitteln
    const navElement = document.querySelector('.nav-wrapper') as HTMLElement;
    if (navElement) {
      const navHeight = navElement.offsetHeight;
      baseOffset = navHeight + 20; // Header-Höhe + 20px Abstand
    }
    
    // Responsive Anpassungen
    if (screenWidth <= 480) {
      return Math.max(baseOffset * 0.7, 72); // Mobile: 72px minimum
    } else if (screenWidth <= 768) {
      return Math.max(baseOffset * 0.85, 88); // Tablet: 88px minimum
    } else {
      return Math.max(baseOffset, 104); // Desktop: 104px minimum
    }
  }

  private smoothScrollTo(target: HTMLElement) {
    const finalOffset = this.getResponsiveOffset();
    const targetRect = target.getBoundingClientRect();
    const targetPosition = targetRect.top + window.pageYOffset - finalOffset;
    
    // Sicherstellen, dass die Position nicht negativ ist
    const safePosition = Math.max(0, targetPosition);
    
    // Verwende native smooth scroll wenn verfügbar und unterstützt
    if ('scrollBehavior' in document.documentElement.style && this.supportsNativeSmoothScroll()) {
      window.scrollTo({
        top: safePosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback mit GSAP für bessere Kontrolle
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: safePosition },
        ease: 'power2.inOut',
        onComplete: () => {
          // Callback für zusätzliche Aktionen nach dem Scroll
          this.onScrollComplete(target);
        }
      });
    }
  }

  // Prüft ob native smooth scroll zuverlässig funktioniert
  private supportsNativeSmoothScroll(): boolean {
    // Safari und ältere Browser haben manchmal Probleme mit smooth scroll
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
    const isOldBrowser = !window.CSS || !window.CSS.supports;
    
    return !isSafari && !isOldBrowser;
  }

  // Callback nach erfolgreichem Scroll
  private onScrollComplete(target: HTMLElement) {
    // Optional: Focus für Accessibility
    if (target.hasAttribute('tabindex') || target.tagName === 'INPUT' || target.tagName === 'BUTTON') {
      target.focus();
    }
    
    // Optional: URL-Hash aktualisieren ohne erneutes Scrollen
    if (this.targetId && history.replaceState) {
      history.replaceState(null, '', `#${this.targetId}`);
    }
  }
}

