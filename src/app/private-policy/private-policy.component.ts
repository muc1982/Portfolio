import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from "../shared/header/header.component";
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from "@ngx-translate/core";
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-private-policy',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, TranslateModule],
  templateUrl: './private-policy.component.html',
  styleUrl: './private-policy.component.scss'
})
export class PrivatePolicyComponent implements OnInit, OnDestroy {
  private routerSubscription?: Subscription;
  currentLang = '';

  constructor(
    private translate: TranslateService, 
    private router: Router
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
}