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
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #00BEE8;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 190, 232, 0.3);
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .scroll-to-top-btn:hover {
      background-color: #0099BB;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 190, 232, 0.4);
    }

    .material-icons {
      color: white;
      font-size: 24px;
      line-height: 1;
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
  `,
  ],
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  showButton = false
  private platformId = inject(PLATFORM_ID)

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener("scroll", this.onScroll.bind(this))
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener("scroll", this.onScroll.bind(this))
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
      })
    }
  }
}