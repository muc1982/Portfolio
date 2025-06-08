import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ScrollBounceDirective } from '../../Instructions/scroll-bounce.directive'
import { LangSwitcherComponent } from '../../shared/lang-switcher/lang-switcher.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // HINZUGEFÜGT

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ScrollBounceDirective, LangSwitcherComponent, TranslateModule, RouterLink, RouterLinkActive], // ERWEITERT
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('navWrapper', { static: true }) navWrapper!: ElementRef<HTMLElement>;
  
  private scrollThreshold = 50;
  private isScrolled = false;
  
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.updateScrollState();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.updateScrollState();
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
}