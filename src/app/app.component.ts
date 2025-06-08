import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";
import { TranslateService } from "@ngx-translate/core";
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, TranslateModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  currentLang: string = "";

  constructor(
    private translate: TranslateService, 
    private router: Router,  
    @Inject(DOCUMENT) private document: Document
  ) {
    this.translate.addLangs(['de', 'en']);
    this.initializeLanguage();
    this.setupRouterEvents();
  }

  private setupRouterEvents(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
      });
  }

  private initializeLanguage(): void {
    try {
      if (typeof Storage !== 'undefined' && localStorage) {
        const storedLang = localStorage.getItem('currentLang');
        if (storedLang && (storedLang === 'de' || storedLang === 'en')) {
          this.setLang(storedLang);
        } else {
          this.setLang('de');
        }
      } else {
        this.setLang('de');
      }
    } catch (error) {
      console.warn('LocalStorage not available, using default language:', error);
      this.setLang('de');
    }
  }

  setLang(l: string): void {
    if (l === 'de' || l === 'en') {
      this.translate.setDefaultLang(l);
      this.currentLang = l;
      this.translate.use(l);
      
      try {
        if (typeof Storage !== 'undefined' && localStorage) {
          localStorage.setItem('currentLang', l);
        }
      } catch (error) {
        console.warn('Could not save language preference:', error);
      }
    }
  }

  ngOnInit(): void {
  }
}