import { Component, type OnInit, inject, Input } from "@angular/core"
import { TranslateService } from "@ngx-translate/core"
import { TranslateModule } from "@ngx-translate/core"
import { AppStateService } from "../../../services/app-state.service"

@Component({
  selector: "app-lang-switcher",
  standalone: true,
  imports: [TranslateModule],
  templateUrl: "./lang-switcher.component.html",
  styleUrl: "./lang-switcher.component.scss",
})
export class LangSwitcherComponent implements OnInit {
  @Input() context: "header" | "menu" | "footer" | "mobile-header" = "header"
  @Input() size: "small" | "medium" | "large" = "medium"

  langs: string[] = ["DE", "EN"]

  private translate = inject(TranslateService)
  private appState = inject(AppStateService)

  get currentLange(): string {
    return this.appState.getCurrentLanguage().toUpperCase()
  }

  get containerClasses(): string {
    const baseClass = "langs"
    const contextClass = `langs--${this.context}`
    const sizeClass = `langs--${this.size}`
    return `${baseClass} ${contextClass} ${sizeClass}`
  }

  get buttonClasses(): string {
    const baseClass = "lang-button"
    const contextClass = `lang-button--${this.context}`
    const sizeClass = `lang-button--${this.size}`
    return `${baseClass} ${contextClass} ${sizeClass}`
  }

  ngOnInit(): void {
    this.appState.initializeFromStorage()
  }

  changeLange(lang: string): void {
    const lowerLang = lang.toLowerCase()
    this.translate.use(lowerLang)
    this.appState.setLanguage(lowerLang)
  }

  isActiveLanguage(lang: string): boolean {
    return lang === this.currentLange
  }

  getAriaLabel(lang: string): string {
    const langMap: { [key: string]: string } = {
      DE: "Deutsch",
      EN: "English",
    }
    return `Switch to ${langMap[lang] || lang}`
  }

  getButtonText(lang: string): string {
    return lang // Zeigt immer DE oder EN an
  }

  getButtonClass(lang: string): string {
    const baseClasses = this.buttonClasses
    const activeClass = this.isActiveLanguage(lang) ? "active" : ""
    return `${baseClasses} ${activeClass}`.trim()
  }
}
