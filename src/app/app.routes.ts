import type { Routes } from "@angular/router" // <- HINZUGEFÜGT: Routes Type Import
// ENTFERNT: import { routes } from './app.routes'; <- Das war der zirkuläre Import!
import { MainPageComponent } from "./main-page/main-page.component"
import { LegalNoticeComponent } from "./legal-notice/legal-notice.component"
import { PrivatePolicyComponent } from "./private-policy/private-policy.component"

export const routes: Routes = [
  {
    path: "",
    component: MainPageComponent,
    pathMatch: "full",
  },
  {
    path: "legal-notice",
    component: LegalNoticeComponent,
    pathMatch: "full",
  },
  {
    path: "private-policy",
    component: PrivatePolicyComponent,
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
]