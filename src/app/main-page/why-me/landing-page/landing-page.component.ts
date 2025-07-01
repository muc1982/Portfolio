import { Component, Input } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { ScrollBounceDirective } from './../../../Instructions/scroll-bounce.directive';
import { ScrollAnimateDirective } from '../../../Instructions/scroll-animation.directive';
import { LandingPageMobileComponent } from './landing-page-mobile/landing-page-mobile.component';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TranslateModule, ScrollBounceDirective, ScrollAnimateDirective, LandingPageMobileComponent, CommonModule], // Fügen Sie TranslateModule und CommonModule hinzu
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor(private translate: TranslateService) {
  }
}

