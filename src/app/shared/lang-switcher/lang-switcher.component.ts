import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from "@ngx-translate/core";
import { AppStateService } from '../../../services/app-state.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss'
})
export class LangSwitcherComponent implements OnInit {
  langs: string[] = ['DE', 'EN'];
  
  private translate = inject(TranslateService);
  private appState = inject(AppStateService);
  
  // Reactive getter für aktuelle Sprache
  get currentLange(): string {
    return this.appState.getCurrentLanguage().toUpperCase();
  }

  ngOnInit(): void {
    this.appState.initializeFromStorage();
  }

  changeLange(lang: string) {
    const lowerLang = lang.toLowerCase();
    this.translate.use(lowerLang);
    this.appState.setLanguage(lowerLang);
  }
}