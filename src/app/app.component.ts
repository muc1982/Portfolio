import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ScrollToTopComponent } from './Instructions/scroll-to-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule, // forRoot wird im main.ts erledigt
    RouterOutlet,
    ScrollToTopComponent
  ],
  template: `
    <router-outlet></router-outlet>
    <app-scroll-to-top></app-scroll-to-top>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentLang: string = '';

  constructor(
    private translate: TranslateService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.translate.addLangs(['de', 'en']);
    this.initializeLanguage();
    this.setupRouterEvents();
  }

  ngOnInit(): void {
    this.setupLogoScrollToTop();
  }

  private setupRouterEvents(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
  }

  private initializeLanguage(): void {
    try {
      const storedLang = localStorage?.getItem('currentLang');
      if (storedLang === 'de' || storedLang === 'en') {
        this.setLang(storedLang);
      } else {
        this.setLang('de');
      }
    } catch {
      this.setLang('de');
    }
  }

  setLang(l: string): void {
    if (l === 'de' || l === 'en') {
      this.translate.setDefaultLang(l);
      this.currentLang = l;
      this.translate.use(l);
      try {
        localStorage?.setItem('currentLang', l);
      } catch {}
    }
  }

  private setupLogoScrollToTop(): void {
    setTimeout(() => {
      const logos = this.document.querySelectorAll('.logo, .logo-img, .logo-wrapper');
      logos.forEach(logo => {
        logo.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }, 1000);
  }
}
