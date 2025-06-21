import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ScrollBounceDirective } from '../../Instructions/scroll-bounce.directive';
import { LangSwitcherComponent } from '../../shared/lang-switcher/lang-switcher.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterLink, RouterLinkActive } from '@angular/router'; // Import RouterLink and RouterLinkActive

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ScrollBounceDirective, LangSwitcherComponent, TranslateModule, CommonModule], // Fügen Sie CommonModule, RouterLink, RouterLinkActive und TranslateModule hinzu
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('navWrapper', { static: true }) navWrapper!: ElementRef<HTMLElement>;

  private scrollThreshold = 50;
  private isScrolled = false;

  // NEUE MOBILE MENU PROPERTIES
  mobileMenuOpen = false;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.updateScrollState();
  }

  ngOnDestroy(): void {
    // Cleanup bei Component Destroy
    this.closeMobileMenu();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.updateScrollState();
  }

  // NEUE: Mobile Menu beim Resize schließen
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth >= 900 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // NEUE: ESC Key Handler
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  private updateScrollState(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const shouldBeScrolled = scrollY > this.scrollThreshold;

    if (shouldBeScrolled !== this.isScrolled) {
      this.isScrolled = shouldBeScrolled;
      this.updateNavStyles();
    }
  }

  private updateNavStyles(): void {
    if (this.navWrapper?.nativeElement) {
      const navElement = this.navWrapper.nativeElement;

      if (this.isScrolled) {
        navElement.classList.add('scrolled');
      } else {
        navElement.classList.remove('scrolled');
      }
    }
  }

  // NEUE MOBILE MENU METHODS
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.updateBodyScrollLock();
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.updateBodyScrollLock();
  }

  private updateBodyScrollLock(): void {
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

