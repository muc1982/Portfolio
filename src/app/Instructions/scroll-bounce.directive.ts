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
  @Input('offsetY') offsetY!: number;
  private lastTargetId: string = '';
  private gs = inject(GlobalService)

  @HostListener('click')
  onClick() {
    const target = document.getElementById(this.targetId);
    if (!target) return;
    if (this.isAlreadyAtTarget(target)) return;
    
    this.gs.lastTargetId = this.targetId;
    const { landingExtra, whyMeExtra } = this.getExtraElements();
    
    this.handleExtraVisibility(landingExtra, whyMeExtra);
    this.startAnimation(target, landingExtra, whyMeExtra);
  }

  private isAlreadyAtTarget(target: HTMLElement): boolean {
    return target?.getBoundingClientRect().top == this.offsetY && 
           this.gs.lastTargetId == this.targetId;
  }

  private getExtraElements() {
    return {
      landingExtra: document.getElementById('landing-page-extra'),
      whyMeExtra: document.getElementById('why-me-extra')
    };
  }

  private handleExtraVisibility(landingExtra: HTMLElement | null, whyMeExtra: HTMLElement | null) {
    if (this.targetId != 'why-me' && whyMeExtra != null) {
      whyMeExtra.style.display = 'none';
    }
    this.showExtras(landingExtra, whyMeExtra);
  }

  showExtras (landingExtra: HTMLElement | null, whyMeExtra: HTMLElement | null) {
    if (this.targetId == 'landing-page' && landingExtra !== null) {
      landingExtra.style.display = 'block';
    }
    if (this.targetId == 'why-me' && whyMeExtra !== null) {
      whyMeExtra.style.display = 'block';
    }
  }

  hiddenExtras (landingExtra: HTMLElement | null, whyMeExtra: HTMLElement | null) {
    if (this.targetId == 'landing-page' && landingExtra !== null) {
      landingExtra.style.display = 'none';
    }
    if (this.targetId == 'why-me' && whyMeExtra !== null) {
      whyMeExtra.style.display = 'none';
    }
  }

  startAnimation(target: HTMLElement | null, landingExtra: HTMLElement | null, whyMeExtra: HTMLElement | null) {
    if (target != null) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: target, offsetY: this.offsetY },
        ease: 'elastic.out(0.5, 0.5)',
        onComplete: () => {
          this.hiddenExtras(landingExtra, whyMeExtra);
        }
      });
    }
  }
}