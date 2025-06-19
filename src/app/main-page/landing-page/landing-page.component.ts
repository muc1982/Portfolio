import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule} from "@ngx-translate/core";
import { ScrollBounceDirective } from '../../Instructions/scroll-bounce.directive'
import { ScrollAnimateDirective } from '../../Instructions/scroll-animation.directive';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TranslateModule, ScrollBounceDirective, ScrollAnimateDirective],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor(private translate: TranslateService) {
  }
}