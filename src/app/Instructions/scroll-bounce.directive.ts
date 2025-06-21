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

  @HostListener('click')
  onClick() {
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
    
    return target;
  }

  // KORRIGIERT: Responsive Offset-Berechnung
  private getResponsiveOffset(): number {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
      return 80;  // Mobile
    } else if (screenWidth <= 768) {
      return 100; // Tablet
    } else {
      return this.offsetY || 120; // Desktop
    }
  }

  private smoothScrollTo(target: HTMLElement) {
    const finalOffset = this.getResponsiveOffset();
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - finalOffset;
    
    // Verwende native smooth scroll wenn verfügbar
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback mit GSAP
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: targetPosition },
        ease: 'power2.inOut'
      });
    }
  }
}