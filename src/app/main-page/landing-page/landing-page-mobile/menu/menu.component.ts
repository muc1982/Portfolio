// menu.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScrollBounceDirective } from '../../../../Instructions/scroll-bounce.directive';
import { LangSwitcherComponent } from '../../../../shared/lang-switcher/lang-switcher.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgIf, NgStyle } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    ScrollBounceDirective, 
    LangSwitcherComponent, 
    TranslateModule, 
    NgIf, 
    NgStyle, 
    RouterLink,           // HINZUGEFÜGT
    RouterLinkActive      // HINZUGEFÜGT
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() wh = 0;
  @Input() top = 0;
  @Input() left = 0;
  @Input() isShowable = true;
  @Output() isShowableChange = new EventEmitter<boolean>();
  
  constructor(private translate: TranslateService) {}

  clickOverlay() {
    this.isShowable = false;
    this.isShowableChange.emit(this.isShowable);
  }
}