import { Component, type OnInit, type OnDestroy, PLATFORM_ID, inject } from "@angular/core"
import { CommonModule, isPlatformBrowser } from "@angular/common"

@Component({
  selector: "app-scroll-to-top",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      *ngIf="showButton" 
      class="scroll-to-top-btn"
      (click)="scrollToTop()"
      aria-label="Scroll to top"
      type="button">
      <span class="material-icons">keyboard_arrow_up</span>
    </button>
  `,
  styles: [
    `
    .scroll-to-top-btn {
      position: fixed;
      bottom: 30px;
      right: 142rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #00BEE8;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-shadow: 0 4px 12px rgba(0, 190, 232, 0.3);
      transition: all 0.3s ease;
      z-index: 1000;
      outline: none;
    }

    .scroll-to-top-btn:hover {
      background-color: #0099BB;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 190, 232, 0.4);
    }

    .scroll-to-top-btn:focus {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }

    .scroll-to-top-btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(0, 190, 232, 0.3);
    }

    .material-icons {
      color: white;
      font-size: 24px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-feature-settings: 'liga';
      -webkit-font-feature-settings: 'liga';
      text-rendering: optimizeLegibility;
      /* Kompensiert Material Icons Verschiebung */
      transform: translateX(0.5px);
      user-select: none;
      -webkit-user-select: none;
    }

    @media (max-width: 768px) {
      .scroll-to-top-btn {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
      }
      
      .material-icons {
        font-size: 20px;
      }
    }

    @media (max-width: 480px) {
      .scroll-to-top-btn {
        bottom: 16px;
        right: 16px;
        width: 42px;
        height: 42px;
      }
      
      .material-icons {
        font-size: 18px;
      }
    }

    /* Accessibility - Reduzierte Bewegung */
    @media (prefers-reduced-motion: reduce) {
      .scroll-to-top-btn {
        transition: none;
      }
      
      .scroll-to-top-btn:hover {
        transform: none;
      }
    }

    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      .scroll-to-top-btn {
        background-color: #1ca9ae;
        box-shadow: 0 4px 12px rgba(28, 169, 174, 0.3);
      }

      .scroll-to-top-btn:hover {
        background-color: #158a8e;
        box-shadow: 0 6px 16px rgba(28, 169, 174, 0.4);
      }
    }
  `,
  ],
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  showButton = false
  private platformId = inject(PLATFORM_ID)
  private scrollListener?: () => void

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Bound function für bessere Performance
      this.scrollListener = this.onScroll.bind(this)
      window.addEventListener("scroll", this.scrollListener, { passive: true })
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener)
    }
  }

  private onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showButton = window.pageYOffset > 300
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
}