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
  wh = 0;
  top = 0;
  left= 0;
  
  constructor(private translate: TranslateService) {}
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateLayout();
    }, 50);
  }

  @HostListener('window:resize')
  onResize() {
    if (this.logoImgRef?.nativeElement) {
      this.calculateLayout();
    }
  }

  calculateLayout() {
    if (!this.logoImgRef?.nativeElement) {
      return;
    }
    
    const el = this.logoImgRef.nativeElement as HTMLElement;
    let menuH = 72 + 25;
    let lower = el.offsetHeight < el.offsetWidth ? el.offsetHeight : el.offsetWidth;
    lower += 25;
    let t = el.offsetTop + menuH - 20;
    this.wh = lower;
    this.top = t;
    this.left = (window.innerWidth - this.wh) / 2;
  }
}