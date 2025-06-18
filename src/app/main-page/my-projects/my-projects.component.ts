import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy, QueryList, ViewChildren, Input } from '@angular/core';
import { Project } from '../../intefaces/project.interface';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import {TranslateModule} from "@ngx-translate/core";
import { Subscription } from 'rxjs';
import { gsap } from 'gsap/gsap-core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../global.service';
import { ScrollBounceDirective } from '../../Instructions/scroll-bounce.directive';
import { MyProjectsMobileComponent } from "./my-projects-mobile/my-projects-mobile.component";

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [TranslateModule, CommonModule, MyProjectsMobileComponent], 
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.scss'
})
export class MyProjectsComponent implements OnDestroy, AfterViewInit {
  @ViewChild('animatedEl1', { static: false }) animatedEl1?: ElementRef;
  @ViewChild('animatedEl2', { static: false }) animatedEl2?: ElementRef;
  @ViewChild('animatedEl3', { static: false }) animatedEl3?: ElementRef;
  @ViewChild('animatedEl4', { static: false }) animatedEl4?: ElementRef;
  @ViewChild('scrollRef') scrollDirective?: ScrollBounceDirective;

  currentTab: number = 0;
  projects: Project[] = [];
  langsArr: string[] = [];

  private langChangeSub?: Subscription;

  constructor(private translate: TranslateService, private globalService: GlobalService) {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    this.initData();
    this.fillLangsarr();
    this.changeText();
    this.setupLanguageChange();
  }

  private setupLanguageChange(): void {
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.changeText();
    });
  }

  initData() {
    const projectData = this.globalService.getProjects();
    projectData.forEach(p => {
      this.projects.push({
        name: p.name,
        transName: p.transName,
        duration: p.duration,
        introductionKey: `${p.keyPrefix}.about`,
        introduction: '',
        workProcessKey: `${p.keyPrefix}.workprocess`,
        workProcess: '',
        workExperienceKey: `${p.keyPrefix}.workexperience`,
        workExperience: '',
        technologies: p.technologies,
        technologiesName: p.technologiesName,
        url: p.url,
        giturl: p.giturl,
        weburl: p.weburl
      });
    });
  }

  fillLangsarr() {
    for (let index = 0; index < this.projects.length; index++) {
      let p = this.projects [index];
      this.langsArr.push(p.introductionKey);
      this.langsArr.push(p.workExperienceKey);
      this.langsArr.push(p.workProcessKey);
    }
  }

  changeText() {
    this.translate.get(this.langsArr).subscribe(translations => {
      this.projects.forEach(project => {
        this.updateProjectTranslations(project, translations);
      });
    });
  }

  private updateProjectTranslations(project: Project, translations: any) {
    if (translations[project.introductionKey]) {
      project.introduction = translations[project.introductionKey];
    }
    if (translations[project.workExperienceKey]) {
      project.workExperience = translations[project.workExperienceKey];
    }
    if (translations[project.workProcessKey]) {
      project.workProcess = translations[project.workProcessKey];
    }
  }

  switchProject(index: number) {
    this.currentTab = index;
    this.registerScrollTrigger();
  }

  toProject(transName: string) {
    const index = this.projects.findIndex(p => p.transName === transName);
    if (index !== -1) {
      this.switchProject(index);
    }

    setTimeout(() => {
      if (this.scrollDirective) {
        this.scrollDirective.targetId = 'my-projects';
        this.scrollDirective.offsetY = 104;
        this.scrollDirective.onClick();
      }
    }, 0);
  }

  registerScrollTrigger (){
    setTimeout(() => {
      ScrollTrigger.getAll().forEach(t => t.kill()); 
      
      this.setupScrollTrigger(this.animatedEl1, 'animate-img-005');
      this.setupScrollTrigger(this.animatedEl2, 'animate-img-075');
      this.setupScrollTrigger(this.animatedEl3, 'animate-img-010');
      this.setupScrollTrigger(this.animatedEl4, 'animate-img-005-from-left');
  
      ScrollTrigger.refresh();
    });
  }

  setupScrollTrigger(elRef?: ElementRef, animationClass?: string) {
    if (!elRef?.nativeElement || !animationClass) return;
  
    ScrollTrigger.create({
      trigger: elRef.nativeElement,
      start: 'top 100%',
      onEnter: () => {
        elRef.nativeElement.classList.add(animationClass);
      },
      onLeaveBack: () => {
        elRef.nativeElement.classList.remove(animationClass);
      },
      onEnterBack: () => {
        elRef.nativeElement.classList.add(animationClass);
      },
      onLeave: () => {
        elRef.nativeElement.classList.remove(animationClass);
      },
    });
  }

  ngAfterViewInit(): void {
    this.registerScrollTrigger();
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }
}