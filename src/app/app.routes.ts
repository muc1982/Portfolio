import type { Routes } from "@angular/router"
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
    path: "privacy-policy", // ← GEÄNDERT: Von "private-policy" zu "privacy-policy"
    component: PrivatePolicyComponent,
    pathMatch: "full",
  },
  {
    path: "private-policy", // ← HINZUGEFÜGT: Redirect für alte URL
    redirectTo: "privacy-policy",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
]