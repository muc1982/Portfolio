import { Injectable, signal, computed } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private currentLanguage = signal('de');
  private currentTheme = signal('dark');
  
  getCurrentLanguage = computed(() => this.currentLanguage());
  getCurrentTheme = computed(() => this.currentTheme());
  
  setLanguage(lang: string) {
    this.currentLanguage.set(lang);
    localStorage.setItem('currentLang', lang);
  }
  
  setTheme(theme: string) {
    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme);
  }
  
  initializeFromStorage() {
    const storedLang = localStorage.getItem('currentLang');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedLang) {
      this.currentLanguage.set(storedLang);
    }
    
    if (storedTheme) {
      this.currentTheme.set(storedTheme);
    }
  }
}