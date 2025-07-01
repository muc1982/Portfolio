    import { ApplicationConfig, importProvidersFrom } from '@angular/core';
    import { provideRouter } from '@angular/router';
    import { provideHttpClient, HttpClient } from '@angular/common/http';
    import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
    import { TranslateHttpLoader } from '@ngx-translate/http-loader';
    import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

    import { routes } from './app.routes'; // Ihre Routen

    // Factory-Funktion für den TranslateLoader
    export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
      return new TranslateHttpLoader(http, './assets/i18n/', '.json');
    }

    export const appConfig: ApplicationConfig = {
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideAnimationsAsync(),
        importProvidersFrom(
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
        )
      ]
    };
    