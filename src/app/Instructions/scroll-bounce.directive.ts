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
  private gs = inject(GlobalService);

  @HostListener('click')
  onClick() {
    const target = document.getElementById(this.targetId);
    if (!target) return;
    
    this.gs.lastTargetId = this.targetId;
    
    this.smoothScrollTo(target);
  }

  private smoothScrollTo(target: HTMLElement) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - this.offsetY;
    
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: targetPosition },
        ease: 'power2.inOut'
      });
    }
  }
}