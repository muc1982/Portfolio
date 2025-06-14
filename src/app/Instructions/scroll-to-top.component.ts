import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="scroll-to-top" 
      [class.visible]="isVisible"
      (click)="scrollToTop()"
      aria-label="Scroll to top">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `,
  styles: [`
    .scroll-to-top {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(0, 122, 255, 0.9);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      z-index: 1000;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      
      &.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      &:hover {
        background: rgba(0, 122, 255, 1);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      svg {
        width: 20px;
        height: 20px;
      }
      
      @media (max-width: 600px) {
        bottom: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
        
        svg {
          width: 18px;
          height: 18px;
        }
      }
    }
  `]
})
export class ScrollToTopComponent {
  isVisible = false;
  private scrollThreshold = 300;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isVisible = window.pageYOffset > this.scrollThreshold;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
