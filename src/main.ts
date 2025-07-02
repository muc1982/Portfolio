import { bootstrapApplication } from "@angular/platform-browser"
import { AppComponent } from "./app/app.component"
import { provideRouter } from "@angular/router"
import { routes } from "./app/app.routes"
import { importProvidersFrom } from "@angular/core"
import { HttpClientModule } from "@angular/common/http"
import { TranslateModule, TranslateLoader } from "@ngx-translate/core"
import { TranslateHttpLoader } from "@ngx-translate/http-loader"
import { HttpClient } from "@angular/common/http"

// ✅ KORREKTE Angular Imports für Vercel
import { inject } from "@vercel/analytics"
import { injectSpeedInsights } from "@vercel/speed-insights"

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json")
}

// ✅ Analytics initialisieren
inject();
injectSpeedInsights();

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: "de",
      }),
    ),
  ],
}).catch((err) => console.error(err))