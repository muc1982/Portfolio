import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule} from "@ngx-translate/core";
import { ScrollBounceDirective } from '../../../Instructions/scroll-bounce.directive'
import { ScrollAnimateDirective } from '../../../Instructions/scroll-animation.directive';
import { MenuComponent } from './menu/menu.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-landing-page-mobile',
  standalone: true,
  imports: [TranslateModule, ScrollBounceDirective, ScrollAnimateDirective, MenuComponent, NgStyle],
  templateUrl: './landing-page-mobile.component.html',
  styleUrl: './landing-page-mobile.component.scss'
})
export class LandingPageMobileComponent implements AfterViewInit {
  @ViewChild('logoImg') logoImgRef!: ElementRef;
  showMenu = false;
  
  constructor(private translate: TranslateService) {}
  
  ngAfterViewInit() {

  }

  @HostListener('window:resize')
  onResize() {

  }


}