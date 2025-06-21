import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { Router, NavigationEnd, RouterLink } from '@angular/router'; // Import RouterLink
import { Location, CommonModule } from '@angular/common'; // Import CommonModule
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LangSwitcherComponent } from '../shared/lang-switcher/lang-switcher.component';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [FooterComponent, TranslateModule, LangSwitcherComponent, CommonModule, RouterLink], // Fügen Sie CommonModule, RouterLink und TranslateModule hinzu
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent implements OnInit, OnDestroy {
  title = 'Legal Notice';
  currentLang = '';
  private routerSubscription?: Subscription;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private location: Location
  ) {
    this.currentLang = this.translate.currentLang;
    
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });  
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
} 

