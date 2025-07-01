import { Component, type ElementRef, ViewChild, type AfterViewInit, HostListener, type OnDestroy } from "@angular/core"
import { TranslateService, TranslateModule } from "@ngx-translate/core"
import { LangSwitcherComponent } from "../../../shared/lang-switcher/lang-switcher.component"
import { NgIf } from "@angular/common"

@Component({
  selector: "app-landing-page-mobile",
  standalone: true,
  templateUrl: "./landing-page-mobile.component.html",
  styleUrls: ["./landing-page-mobile.component.scss"],
  imports: [TranslateModule, NgIf, LangSwitcherComponent],
})
export class LandingPageMobileComponent implements AfterViewInit, OnDestroy {
  @ViewChild("logoImg") logoImgRef!: ElementRef
  showMenu = false
  private scrollPosition = 0

  constructor(private translate: TranslateService) {}

  ngAfterViewInit(): void {
    this.adjustViewport()
  }

  ngOnDestroy(): void {
    this.forceResetMenu()
  }

  @HostListener("window:resize")
  onResize(): void {
    this.adjustViewport()

    if (window.innerWidth > 767 && this.showMenu) {
      this.forceResetMenu()
    }
  }

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    if (this.showMenu) {
      this.closeMenu()
    }
  }

  @HostListener("touchstart", ["$event"])
  onTouchStart(event: TouchEvent): void {
    const target = event.target as HTMLElement
    if (target?.closest(".burger-menu-btn")) {
      event.stopPropagation()
    }
  }

  toggleMenu(event?: Event): void {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (this.showMenu) {
      this.forceResetMenu()
    } else {
      this.openMenu()
    }
  }

  private openMenu(): void {
    this.showMenu = true
    this.lockBodyScroll()
  }

  closeMenu(): void {
    this.showMenu = false
    this.restoreBodyScroll()
  }

  private forceResetMenu(): void {
    this.showMenu = false
    this.restoreBodyScroll()

    setTimeout(() => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }, 50)
  }

  private lockBodyScroll(): void {
    this.scrollPosition = window.pageYOffset

    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${this.scrollPosition}px`
    document.body.style.width = "100%"
  }

  private restoreBodyScroll(): void {
    document.body.style.overflow = ""
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""

    if (this.scrollPosition > 0) {
      window.scrollTo(0, this.scrollPosition)
    }
  }

  scrollTo(sectionId: string): void {
    this.closeMenu()

    setTimeout(() => {
      this.performScrollToSection(sectionId)
    }, 100)
  }

  private performScrollToSection(sectionId: string): void {
    let targetId = sectionId

    if (sectionId === "my-skills") {
      const mobileElement = document.getElementById("my-skills-mobile")
      if (mobileElement) {
        targetId = "my-skills-mobile"
      }
    } else if (sectionId === "my-projects") {
      const mobileElement = document.getElementById("my-projects-mobile")
      if (mobileElement) {
        targetId = "my-projects-mobile"
      }
    } else if (sectionId === "contact-me") {
      const mobileElement = document.getElementById("contact-me-mobile")
      if (mobileElement) {
        targetId = "contact-me-mobile"
      }
    }

    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 76
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  private adjustViewport(): void {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }
}