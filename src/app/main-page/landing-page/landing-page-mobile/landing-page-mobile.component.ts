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
    this.forceResetMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustViewport();
    
    if (window.innerWidth > 767 && this.showMenu) {
      this.forceResetMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showMenu) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    console.log('Toggle Menu - Current state:', this.showMenu, 'Window width:', window.innerWidth);
    
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

  closeMenu(): void {
    console.log('Closing Menu via closeMenu()');
    this.showMenu = false;
    this.restoreBodyScroll();
  }

  private forceResetMenu(): void {
    console.log('Force Reset Menu');
    this.showMenu = false;
    this.restoreBodyScroll();
    
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
    
    if (this.scrollPosition > 0) {
      window.scrollTo(0, this.scrollPosition);
    }
  }

  scrollTo(sectionId: string): void {
    console.log('ScrollTo called:', sectionId);
    
    this.closeMenu();
    
    setTimeout(() => {
      this.performScrollToSection(sectionId);
    }, 100);
  }

  private performScrollToSection(sectionId: string): void {
     let targetId = sectionId;
    
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
      const headerOffset = 72; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Element with ID '${targetId}' not found`);
    }
  }

  private adjustViewport(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const target = event.target as HTMLElement;
    if (target?.closest('.burger-menu-btn')) {
      event.preventDefault();
    }
  }
}