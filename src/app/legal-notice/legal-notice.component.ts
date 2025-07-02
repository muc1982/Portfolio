import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FooterComponent } from "../shared/footer/footer.component";
import { LangSwitcherComponent } from "../shared/lang-switcher/lang-switcher.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-legal-notice",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    FooterComponent,
    LangSwitcherComponent
  ],
  templateUrl: "./legal-notice.component.html",
  styleUrls: [
    "./legal-notice.component.scss",
    "./partials/_legal-notice-layout.scss",
    "./partials/_legal-notice-typography.scss",
    "./partials/_legal-notice-responsive.scss",
    "./partials/_legal-notice-animations.scss"
  ]
})
export class LegalNoticeComponent implements OnInit, OnDestroy {
  currentLang: string | undefined;
  private langChangeSubscription: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private location: Location
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    // Setze die aktuelle Sprache
    this.currentLang = this.translate.currentLang;
    
    // Abonniere Sprachänderungen
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  ngOnDestroy(): void {
    // Subscription beenden, um Memory Leaks zu vermeiden
    this.langChangeSubscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }
}
