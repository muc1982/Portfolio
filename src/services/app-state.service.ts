import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly currentLanguage = signal('de');
  
  getCurrentLanguage = computed(() => this.currentLanguage());
  
  setLanguage(lang: string): void {
    this.currentLanguage.set(lang);
    try {
      localStorage.setItem('currentLang', lang);
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }
  }
  
  initializeFromStorage(): void {
    try {
      const storedLang = localStorage.getItem('currentLang');
      if (storedLang && (storedLang === 'de' || storedLang === 'en')) {
        this.currentLanguage.set(storedLang);
      }
    } catch (error) {
      console.warn('Could not load language preference:', error);
    }
  }
}