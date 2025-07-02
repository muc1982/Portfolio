import { Component, type OnInit, OnDestroy } from "@angular/core"
import { CommonModule, Location } from "@angular/common"
import { RouterLink } from "@angular/router"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { Subscription } from "rxjs";

@Component({
  selector: "app-private-policy",
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    TranslateModule
    // FooterComponent und LangSwitcherComponent später hinzufügen
  ],
  templateUrl: "./private-policy.component.html",
  styleUrls: [
    "./private-policy.component.scss"
    // ERSTMAL NUR DIE HAUPT-SCSS-DATEI
    // Die partials später einzeln hinzufügen wenn alles funktioniert
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
    console.log('PrivatePolicyComponent mit originalem Design geladen!');
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