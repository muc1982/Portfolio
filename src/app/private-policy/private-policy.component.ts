import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from "@ngx-translate/core";
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LangSwitcherComponent } from '../shared/lang-switcher/lang-switcher.component';

@Component({
  selector: 'app-private-policy',
  standalone: true,
  imports: [FooterComponent, TranslateModule, LangSwitcherComponent],
  templateUrl: './private-policy.component.html',
  styleUrl: './private-policy.component.scss'
})
export class PrivatePolicyComponent implements OnInit, OnDestroy {
  private routerSubscription?: Subscription;
  currentLang = '';

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
    // Scroll to top when component loads
    window.scrollTo(0, 0);
    
    // Subscribe to router events for proper navigation handling
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
    this.location.back();
  }
}