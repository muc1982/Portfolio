Yasin Sun - Portfolio
Ein modernes, responsives Portfolio entwickelt mit Angular 19 und TypeScript.

🚀 Live Demo
Die Anwendung ist verfügbar unter: https://sun-dev.de/

📋 Features
Moderne Angular-Architektur - Angular 19 mit Standalone Components
Vollständig Responsiv - Optimiert für Desktop, Tablet und Mobile
Mehrsprachig - Deutsch und Englisch mit ngx-translate
Apple Design System - Moderne UI mit Apple-inspirierten Animationen
GSAP Animationen - Flüssige Scroll-Animationen und Transitions
PWA-Ready - Progressive Web App Funktionalitäten
TypeScript - Typsichere Entwicklung
SCSS Modularchitektur - Strukturierte Styles mit Apple Design Variables

🛠️ Technologien
Frontend: Angular 19, TypeScript, SCSS
Animationen: GSAP, CSS3 Transitions
Internationalisierung: ngx-translate
Build Tool: Angular CLI
Hosting: Firebase Hosting

📱 Responsive Design
Desktop: 1920px+ (4K Support)
Laptop: 1440px - 1920px
Tablet: 768px - 1200px
Mobile: 320px - 768px
Landscape Support: Alle Gerätegrößen

🎨 Design System
Das Portfolio verwendet ein konsistentes Apple-inspiriertes Design System:

Farben: Dunkles Theme mit Teal-Akzenten
Typography: Apple System Font Stack
Animationen: Flüssige Micro-Interactions
Components: Wiederverwendbare UI-Komponenten
Glassmorphism: Moderne Backdrop-Filter Effekte

📦 Installation & Entwicklung
bash
# Repository klonen
git clone https://github.com/muc1982/Portfolio.git

# Dependencies installieren
npm install

# Entwicklungsserver starten
ng serve

# Build für Produktion
ng build --configuration production
Die Anwendung läuft dann unter http://localhost:4200/

📂 Projektstruktur
src/
├── app/
│   ├── main-page/           # Hauptseiten-Komponenten
│   │   ├── landing-page/    # Landing Page mit Animationen
│   │   ├── why-me/          # Über mich Sektion
│   │   ├── my-skills/       # Skills Übersicht
│   │   ├── my-projects/     # Portfolio Projekte
│   │   └── contact-me/      # Kontakt Formulare
│   ├── shared/              # Geteilte Komponenten
│   │   ├── header/          # Navigation Header
│   │   ├── footer/          # Footer Komponenten
│   │   └── lang-switcher/   # Sprachumschaltung
│   ├── legal-notice/        # Impressum
│   └── private-policy/      # Datenschutz
├── assets/                  # Statische Ressourcen
│   ├── img/                 # Bilder und Icons
│   └── i18n/                # Übersetzungsdateien
├── style/                   # SCSS Design System
│   ├── variables/           # SCSS Variablen
│   └── apple-variables.scss # Apple Design System
└── services/                # Angular Services

🌍 Mehrsprachigkeit
Das Portfolio unterstützt:

Deutsch (DE) - Standardsprache
Englisch (EN) - Vollständige Übersetzung
Übersetzungen werden dynamisch geladen und in localStorage gespeichert.

🎯 Kernfunktionen
Navigation
Smooth Scroll Navigation zwischen Sektionen
Responsive Mobile Menu
Active State Indicator
RouterLink für Impressum/Datenschutz
Animationen
GSAP Scroll-Trigger Animationen
CSS3 Hover-Effekte
Intersection Observer für Performance
Apple-Style Micro-Interactions
Formulare
Reaktives Kontaktformular
Formspree Integration für E-Mail-Versand
Validierung mit visuellen Feedback
Datenschutz-Checkbox
Performance
Lazy Loading von Komponenten
Optimierte Bilder
Minimiertes CSS/JS
CDN für externe Ressourcen

📧 Kontakt
Email: info@sun-dev.de
GitHub: github.com/muc1982
Portfolio: sun-dev.de

🔧 Browser Support
Chrome/Edge: 90+
Firefox: 88+
Safari: 14+
Mobile: iOS 14+, Android 10+

📄 Deployment
Das Portfolio wird automatisch über Firebase Hosting deployed:

bash
# Build für Produktion
ng build --configuration production

# Firebase Deployment (falls konfiguriert)
firebase deploy
🚀 Performance Optimierungen
Bundle Splitting: Lazy Loading für bessere Ladezeiten
Image Optimization: WebP Format mit Fallbacks
CSS Optimierung: Purge unused CSS
Caching: Service Worker für Offline-Fähigkeit
Compression: Gzip/Brotli Komprimierung

📊 Lighthouse Scores
Performance: 95+
Accessibility: 100
Best Practices: 100
SEO: 95+

🔄 Entwicklungsworkflow
Feature Development: Feature-Branches für neue Funktionen
Code Review: Pull Requests für Qualitätssicherung
Testing: Unit Tests mit Jasmine/Karma
Deployment: Automatisches Deployment über CI/CD

📝 Changelog
Version 1.0.0
Initiale Release mit vollständigem Portfolio
Responsive Design für alle Geräte
Mehrsprachige Unterstützung
Apple Design System Implementation

📄 Lizenz
Dieses Projekt ist urheberrechtlich geschützt. Alle Rechte vorbehalten.

Entwickelt mit ❤️ von Yasin Sun

Portfolio erstellt im Rahmen der Angular Fullstack Developer Ausbildung bei der Developer Akademie.

