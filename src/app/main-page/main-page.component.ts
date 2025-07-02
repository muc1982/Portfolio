import { Component, type ElementRef, ViewChild, type OnInit, type OnDestroy, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { TranslateModule } from "@ngx-translate/core"
import { LandingPageComponent } from "./landing-page/landing-page.component"
import { WhyMeComponent } from "./why-me/why-me.component"
import { MySkillsComponent } from "./my-skills/my-skills.component"
import { MyProjectsComponent } from "./my-projects/my-projects.component"
import { ContactMeComponent } from "./contact-me/contact-me.component"
import { NavComponent } from "./nav/nav.component"
import { FooterComponent } from "../shared/footer/footer.component"
import { ContactMeMobileComponent } from "./contact-me/contact-me-mobile/contact-me-mobile.component"
import { ScrollToTopComponent } from "../Instructions/scroll-to-top.component"
import { GlobalService } from "../global.service"

@Component({
  selector: "app-main-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LandingPageComponent,
    WhyMeComponent,
    MySkillsComponent,
    MyProjectsComponent,
    ContactMeComponent,
    NavComponent,
    FooterComponent,
    ContactMeMobileComponent,
    ScrollToTopComponent, // <- Hinzugefügt!
  ],
  templateUrl: "./main-page.component.html",
  styleUrl: "./main-page.component.scss",
})
export class MainPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("scrollArea", { static: true }) scrollArea!: ElementRef<HTMLElement>

  constructor(private globalService: GlobalService) {}

  ngOnInit(): void {
    // Scroll to top beim Laden der Seite
    window.scrollTo(0, 0)
  }

  ngAfterViewInit(): void {
    // Zusätzliche Initialisierung nach dem View-Laden
    this.initializeResponsiveHandling()
  }

  private initializeResponsiveHandling(): void {
    // Optional: Event Listener für Responsive-Handling
    this.handleResponsiveChanges()
  }

  private handleResponsiveChanges(): void {
    // Überwacht Bildschirmgrößen-Änderungen für bessere UX
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        // Hier könnten responsive Anpassungen gemacht werden
        this.checkViewportSize()
      })
    }
  }

  private checkViewportSize(): void {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 900
      const isDesktop = window.innerWidth >= 900

      // Zusätzliche Logik für Viewport-Änderungen
      // z.B. Event-Handling oder State-Updates

      if (isMobile) {
        // Mobile-spezifische Anpassungen
        this.handleMobileView()
      } else if (isDesktop) {
        // Desktop-spezifische Anpassungen
        this.handleDesktopView()
      }
    }
  }

  private handleMobileView(): void {
    // Mobile-spezifische Initialisierungen
    // z.B. Touch-Events, Mobile Navigation etc.
  }

  private handleDesktopView(): void {
    // Desktop-spezifische Initialisierungen
    // z.B. Hover-Effects, Desktop Navigation etc.
  }

  ngOnDestroy(): void {
    // Cleanup falls Event Listener oder Subscriptions vorhanden
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.checkViewportSize)
    }
  }
}