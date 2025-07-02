import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  OnDestroy,
  TrackByFunction
} from '@angular/core';
import { Project } from '../../../intefaces/project.interface';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap/gsap-core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import { ScrollBounceDirective } from '../../../Instructions/scroll-bounce.directive';
import { GlobalService } from '../../../global.service';
import { ScrollAnimateDirective } from '../../../Instructions/scroll-animation.directive';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-my-projects-mobile',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ScrollBounceDirective,
    ScrollAnimateDirective
  ],
  templateUrl: './my-projects-mobile.component.html',
  
})
export class MyProjectsMobileComponent implements OnDestroy, AfterViewInit {
  @ViewChild('animatedEl1', { static: false }) animatedEl1?: ElementRef;
  @ViewChild('animatedEl2', { static: false }) animatedEl2?: ElementRef;
  @ViewChild('animatedEl3', { static: false }) animatedEl3?: ElementRef;
  @ViewChild('animatedEl4', { static: false }) animatedEl4?: ElementRef;
  @ViewChild('scrollRef') scrollDirective?: ScrollBounceDirective;
  @ViewChildren('test111', { read: ElementRef }) fadeElements!: QueryList<ElementRef>;

  currentTab: number = 0;
  projects: Project[] = [];
  langsArr: string[] = [];

  private langChangeSub?: Subscription;

  // Empfohlene und funktionierende trackBy-Funktion
  trackByIndex: TrackByFunction<Project> = (index: number, _item: Project) => index;

  constructor(
    private translate: TranslateService,
    private globalService: GlobalService
  ) {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    this.initData();
    this.fillLangsarr();
    this.changeText();
    this.setupLanguageChange();
  }

  private setupLanguageChange(): void {
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.changeText();
    });
  }

  initData(): void {
    const projectData = this.globalService.getProjects();
    this.projects = projectData.map(p => ({
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
    }));
  }

  fillLangsarr(): void {
    this.langsArr = this.projects.flatMap(p => [
      p.introductionKey,
      p.workExperienceKey,
      p.workProcessKey
    ]);
  }

  changeText(): void {
    this.translate.get(this.langsArr).subscribe(translations => {
      this.projects.forEach(project => {
        project.introduction = translations[project.introductionKey] || '';
        project.workExperience = translations[project.workExperienceKey] || '';
        project.workProcess = translations[project.workProcessKey] || '';
      });
    });
  }

  switchProject(index: number): void {
    this.currentTab = index;
    this.registerScrollTrigger();
  }

  toProject(transName: string): void {
    const index = this.projects.findIndex(p => p.transName === transName);
    if (index !== -1) {
      this.switchProject(index);
    }

    setTimeout(() => {
      if (this.scrollDirective) {
        this.scrollDirective.targetId = 'my-projects-mobile';
        this.scrollDirective.offsetY = 104;
        this.scrollDirective.onClick();
      }
    }, 0);
  }

  registerScrollTrigger(): void {
    setTimeout(() => {
      ScrollTrigger.getAll().forEach(t => t.kill());

      this.setupScrollTrigger(this.animatedEl1, 'animate-img-005');
      this.setupScrollTrigger(this.animatedEl2, 'animate-img-075');
      this.setupScrollTrigger(this.animatedEl3, 'animate-img-010');
      this.setupScrollTrigger(this.animatedEl4, 'animate-img-005-from-left');

      ScrollTrigger.refresh();
    });
  }

  setupScrollTrigger(elRef?: ElementRef, animationClass?: string): void {
    if (!elRef?.nativeElement || !animationClass) return;

    ScrollTrigger.create({
      trigger: elRef.nativeElement,
      start: 'top 100%',
      onEnter: () => elRef.nativeElement.classList.add(animationClass),
      onLeaveBack: () => elRef.nativeElement.classList.remove(animationClass),
      onEnterBack: () => elRef.nativeElement.classList.add(animationClass),
      onLeave: () => elRef.nativeElement.classList.remove(animationClass)
    });
  }

  ngAfterViewInit(): void {
    this.registerScrollTrigger();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          console.log(entry.isIntersecting ? 'enter view' : 'out of view');
        }
      },
      { threshold: 0.1 }
    );

    this.fadeElements.forEach(el => observer.observe(el.nativeElement));
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }
}
