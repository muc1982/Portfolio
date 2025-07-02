import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageMobileComponent } from './landing-page/landing-page-mobile/landing-page-mobile.component';
import { NavComponent } from './nav/nav.component';
import { WhyMeComponent } from './why-me/why-me.component';
import { MySkillsComponent } from './my-skills/my-skills.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { MyProjectsMobileComponent } from './my-projects/my-projects-mobile/my-projects-mobile.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { ContactMeMobileComponent } from './contact-me/contact-me-mobile/contact-me-mobile.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ScrollToTopComponent } from '../Instructions/scroll-to-top.component';

import { GlobalService } from '../global.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    LandingPageComponent,
    LandingPageMobileComponent,
    NavComponent,
    WhyMeComponent,
    MySkillsComponent,
    MyProjectsComponent,
    MyProjectsMobileComponent,
    ContactMeComponent,
    ContactMeMobileComponent,
    FooterComponent,
    ScrollToTopComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollArea', { static: true }) scrollArea!: ElementRef<HTMLElement>;

  isMobile = false;
  private resizeListener = () => this.checkViewportSize();

  constructor(private globalService: GlobalService) {}

  ngOnInit(): void {
    this.checkViewportSize();
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    this.initializeResponsiveHandling();
  }

  private initializeResponsiveHandling(): void {
    this.handleResponsiveChanges();
  }

  private handleResponsiveChanges(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeListener);
    }
  }

  private checkViewportSize(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 900;
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
