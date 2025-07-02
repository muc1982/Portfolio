import { Component, OnInit, Input } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LangSwitcherComponent } from "../lang-switcher/lang-switcher.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    LangSwitcherComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss"
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() showBackButton: boolean = true;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {}

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.location.back();
  }
}
