import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject } from 'rxjs';

interface BreakpointResult {
  matches: boolean;
}

interface FooterLayout {
  gridTemplate: string;
  gridAreas: string[];
  itemSpacing: string;
  contentPadding: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
}

interface FooterData {
  logoName: string;
  logoPosition: string;
  socialLinks: SocialLink[];
  copyrightText: string;
  currentYear: number;
}

@Component({
  selector: 'app-footer-mobile',
  standalone: true,
  imports: [TranslateModule, RouterLink, RouterLinkActive],
  templateUrl: './footer-mobile.component.html',
  styleUrl: './footer-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterMobileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  private layoutConfigs: { [key: string]: FooterLayout } = {
    extraSmall: { 
      gridTemplate: 'auto auto auto',
      gridAreas: ['logo', 'social', 'legal'],
      itemSpacing: '12px',
      contentPadding: '12px 8px'
    },
    small: { 
      gridTemplate: 'auto auto auto',
      gridAreas: ['logo', 'social', 'legal'],
      itemSpacing: '16px',
      contentPadding: '16px 12px'
    },
    medium: { 
      gridTemplate: 'auto auto',
      gridAreas: ['logo social', 'legal legal'],
      itemSpacing: '20px',
      contentPadding: '20px 16px'
    },
    tablet: { 
      gridTemplate: 'auto',
      gridAreas: ['legal logo social'],
      itemSpacing: '24px',
      contentPadding: '24px 20px'
    }
  };
  
  currentLayout: FooterLayout = this.getDefaultLayout();
  isExtraSmall = false;
  isSmall = false;
  isMedium = false;
  isTablet = false;

  footerData: FooterData = {
    logoName: 'Yasin Sun',
    logoPosition: 'Developer',
    socialLinks: [
      {
        name: 'github',
        url: 'https://github.com/muc1982',
        icon: 'github.png',
        ariaLabel: 'GitHub Profile - View my code repositories'
      },
      {
        name: 'email',
        url: 'mailto:info@sun-dev.de',
        icon: 'mail.png',
        ariaLabel: 'Send Email - Contact me directly'
      }
      // ENTFERNT: LinkedIn-Link da kein aktives Profil vorhanden
      // {
      //   name: 'linkedin',
      //   url: 'https://www.linkedin.com/',
      //   icon: 'linkedin.png',
      //   ariaLabel: 'LinkedIn Profile'
      // }
    ],
    copyrightText: '© Yasin Sun',
    currentYear: new Date().getFullYear()
  };

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateLayoutForCurrentBreakpoint();
  }

  ngOnInit(): void {
    this.updateLayoutForCurrentBreakpoint();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupResizeObserver(): void {
    if (typeof window !== 'undefined') {
      this.updateLayoutForCurrentBreakpoint();
      
      let resizeTimer: number;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          this.updateLayoutForCurrentBreakpoint();
        }, 100);
      });
    }
  }

  private updateLayout(breakpoint: string): void {
    const config = this.layoutConfigs[breakpoint];
    if (config) {
      this.currentLayout = { ...config };
      this.applyDynamicStyles();
    }
  }

  private updateLayoutForCurrentBreakpoint(): void {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    this.isExtraSmall = false;
    this.isSmall = false;
    this.isMedium = false;
    this.isTablet = false;
    
    if (width <= 374) {
      this.isExtraSmall = true;
      this.updateLayout('extraSmall');
    } else if (width <= 479) {
      this.isSmall = true;
      this.updateLayout('small');
    } else if (width <= 767) {
      this.isMedium = true;
      this.updateLayout('medium');
    } else if (width <= 899) {
      this.isTablet = true;
      this.updateLayout('tablet');
    } else {
      this.isSmall = true; 
      this.updateLayout('small');
    }
  }

  private applyDynamicStyles(): void {
    const footerElement = document.querySelector('.footer-content') as HTMLElement;
    if (footerElement) {
      footerElement.style.setProperty('--grid-template-rows', this.currentLayout.gridTemplate);
      footerElement.style.setProperty('--item-spacing', this.currentLayout.itemSpacing);
      footerElement.style.setProperty('--content-padding', this.currentLayout.contentPadding);
    }
  }

  private getDefaultLayout(): FooterLayout {
    return {
      gridTemplate: 'auto auto auto',
      gridAreas: ['logo', 'social', 'legal'],
      itemSpacing: '16px',
      contentPadding: '16px 12px'
    };
  }

  get gridTemplateAreas(): string {
    return this.currentLayout.gridAreas.map(area => `"${area}"`).join(' ');
  }

  get socialLinks(): SocialLink[] {
    return this.footerData.socialLinks;
  }

  get logoData() {
    return {
      name: this.footerData.logoName,
      position: this.footerData.logoPosition
    };
  }

  get copyrightDisplay(): string {
    return `${this.footerData.copyrightText} ${this.footerData.currentYear}`;
  }

  onSocialLinkClick(link: SocialLink): void {
    // Tracking für Analytics (optional)
    console.log(`Clicked on ${link.name}`);
    
    // Zusätzliche Validierung für externe Links
    if (link.name === 'github' && link.url.includes('github.com')) {
      // GitHub-Link ist valide
      return;
    }
    
    if (link.name === 'email' && link.url.startsWith('mailto:')) {
      // Email-Link ist valide
      return;
    }
  }

  onLogoClick(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  getSocialLinkAriaLabel(link: SocialLink): string {
    return link.ariaLabel || `Visit ${link.name}`;
  }

  shouldShowCompactLayout(): boolean {
    return this.isExtraSmall || this.isSmall;
  }

  shouldShowHorizontalLayout(): boolean {
    return this.isMedium || this.isTablet;
  }

  getResponsiveClass(): string {
    if (this.isExtraSmall) return 'extra-small';
    if (this.isSmall) return 'small';
    if (this.isMedium) return 'medium';
    if (this.isTablet) return 'tablet';
    return 'default';
  }

  trackBySocialLink(index: number, item: SocialLink): string {
    return item.name;
  }
}

