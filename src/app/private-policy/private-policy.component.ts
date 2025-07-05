import { Component, type OnInit, OnDestroy } from "@angular/core"
import { CommonModule, Location } from "@angular/common"
import { RouterLink } from "@angular/router"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { LangSwitcherComponent } from "../shared/lang-switcher/lang-switcher.component"
import { FooterComponent } from "../shared/footer/footer.component"  // Footer hinzugefügt
import { Subscription } from "rxjs";

@Component({
  selector: "app-private-policy",
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    TranslateModule,
    LangSwitcherComponent,
    FooterComponent  // Footer hinzugefügt
  ],
  templateUrl: "./private-policy.component.html",
  styleUrls: [
    "./private-policy.component.scss",
    "./partials/_private-policy-layout.scss",
    "./partials/_private-policy-typography.scss",
    "./partials/_private-policy-responsive.scss",
    "./partials/_private-policy-animations.scss"
  ],
})
export class PrivatePolicyComponent implements OnInit, OnDestroy {
  currentLang: string | undefined;
  private langChangeSubscription: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    this.currentLang = this.translate.currentLang;
    
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }
}