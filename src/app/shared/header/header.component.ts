// header.component.ts
import { Component, type OnInit, Input } from "@angular/core"
import { CommonModule, Location } from "@angular/common"
import { RouterLink, RouterLinkActive, Router } from "@angular/router"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { LangSwitcherComponent } from "../lang-switcher/lang-switcher.component"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, TranslateModule, LangSwitcherComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
  @Input() title: string = ''
  @Input() showBackButton: boolean = true

  constructor(
    private translate: TranslateService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  navigateToHome(): void {
    this.router.navigate(["/"])
  }

  goBack(): void {
    this.location.back()
  }
}