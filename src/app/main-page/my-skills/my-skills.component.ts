import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ScrollBounceDirective } from '../../Instructions/scroll-bounce.directive';
import { ScrollAnimateDirective } from '../../Instructions/scroll-animation.directive';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

interface Skill {
  name: string;
  url: string;
  category?: 'frontend' | 'backend' | 'tools' | 'database';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface LearningSkill {
  name: string;
  url: string;
  progress: number; // 0-100
}

@Component({
  selector: 'app-my-skills',
  standalone: true,
  imports: [TranslateModule, ScrollAnimateDirective, ScrollBounceDirective, CommonModule],
  templateUrl: './my-skills.component.html',
  styleUrl: './my-skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MySkillsComponent implements OnInit, OnDestroy {
  @Input() isMobileView: boolean = false;
  
  private languageSubscription?: Subscription;

  // Hauptskills mit erweiterten Informationen
  skillArr: Skill[] = [
    { name: 'Angular', url: 'angular', category: 'frontend', level: 'advanced' },
    { name: 'TypeScript', url: 'typescript', category: 'frontend', level: 'advanced' },
    { name: 'JavaScript', url: 'javascript', category: 'frontend', level: 'expert' },
    { name: 'HTML', url: 'html', category: 'frontend', level: 'expert' },
    { name: 'CSS', url: 'css', category: 'frontend', level: 'advanced' },
    { name: 'Rest-Api', url: 'restapi', category: 'backend', level: 'intermediate' },
    { name: 'Firebase', url: 'firebase', category: 'backend', level: 'intermediate' },
    { name: 'GIT', url: 'git', category: 'tools', level: 'advanced' },
    { name: 'Material Design', url: 'design', category: 'frontend', level: 'intermediate' },
    { name: 'Scrum', url: 'scrum', category: 'tools', level: 'intermediate' },
    { name: 'SQL', url: 'sql', category: 'database', level: 'intermediate' }
  ];

  // Aktuell lernende Skills
  learningSkills: LearningSkill[] = [
    { name: 'React', url: 'react', progress: 65 },
    { name: 'Vue', url: 'vue', progress: 45 }
  ];

  // Kategorisierte Skills für bessere Organisation
  frontendSkills: Skill[] = [];
  backendSkills: Skill[] = [];
  toolSkills: Skill[] = [];
  databaseSkills: Skill[] = [];

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.categorizeSkills();
    this.setupLanguageSubscription();
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  // Getter für Template-Klassen
  get containerClass(): string {
    return this.isMobileView ? 'my-skills-container-mobile' : 'my-skills-container';
  }

  get containerIdAttribute(): string {
    return this.isMobileView ? 'my-skills-mobile' : 'my-skills';
  }

  get contentClass(): string {
    return this.isMobileView ? 'my-skills-content-mobile' : 'my-skills-content';
  }

  get scrollTargetId(): string {
    return this.isMobileView ? 'contact-me-mobile' : 'contact-me';
  }

  get contactOffset(): number {
    return this.isMobileView ? 72 : 104;
  }

  // Layout-Helper
  get shouldShowMobileLayout(): boolean {
    return this.isMobileView;
  }

  get shouldShowDesktopLayout(): boolean {
    return !this.isMobileView;
  }

  get reservoirClass(): string {
    return this.isMobileView ? 'reservoir-mobile' : 'reservoir';
  }

  get skillItemClass(): string {
    return this.isMobileView ? 'skill-item-mobile' : 'skill-item';
  }

  get skillIconClass(): string {
    return this.isMobileView ? 'skill-icon-mobile' : 'skill-icon';
  }

  get skillNameClass(): string {
    return this.isMobileView ? 'skill-name-mobile' : 'skill-name';
  }

  // Skills nach Kategorien sortieren
  private categorizeSkills(): void {
    this.frontendSkills = this.skillArr.filter(skill => skill.category === 'frontend');
    this.backendSkills = this.skillArr.filter(skill => skill.category === 'backend');
    this.toolSkills = this.skillArr.filter(skill => skill.category === 'tools');
    this.databaseSkills = this.skillArr.filter(skill => skill.category === 'database');
  }

  // Sprachänderungen abonnieren
  private setupLanguageSubscription(): void {
    this.languageSubscription = this.translateService.onLangChange.subscribe(() => {
      // Hier könnten sprachspezifische Anpassungen vorgenommen werden
      console.log('Language changed in MySkillsComponent');
    });
  }

  // Skill-Level als CSS-Klasse zurückgeben
  getSkillLevelClass(skill: Skill): string {
    return `skill-level-${skill.level || 'intermediate'}`;
  }

  // Skill-Kategorie als CSS-Klasse zurückgeben
  getSkillCategoryClass(skill: Skill): string {
    return `skill-category-${skill.category || 'general'}`;
  }

  // Progress-Bar-Breite für lernende Skills
  getProgressWidth(skill: LearningSkill): string {
    return `${Math.min(100, Math.max(0, skill.progress))}%`;
  }

  // Track-by-Funktionen für *ngFor Performance
  trackBySkillName(index: number, skill: Skill): string {
    return skill.name;
  }

  trackByLearningSkillName(index: number, skill: LearningSkill): string {
    return skill.name;
  }

  // Skill-Icon-Pfad generieren
  getSkillIconPath(skill: Skill | LearningSkill): string {
    return `assets/img/skill-${skill.url}.png`;
  }

  // Hover-Handler für Skills (optional für Analytics)
  onSkillHover(skill: Skill): void {
    console.log(`Hovered over skill: ${skill.name}`);
  }

  onSkillClick(skill: Skill): void {
    console.log(`Clicked on skill: ${skill.name}`);
  }

  // Learning Skills Methoden
  onLearningSkillClick(skill: LearningSkill): void {
    console.log(`Clicked on learning skill: ${skill.name} (${skill.progress}% progress)`);
  }

  // Talk-Button Handler
  onTalkButtonClick(): void {
    console.log('Talk button clicked in Skills component');
  }

  // Utility-Methoden
  getTotalSkillsCount(): number {
    return this.skillArr.length;
  }

  getLearningSkillsCount(): number {
    return this.learningSkills.length;
  }

  getAverageProgress(): number {
    if (this.learningSkills.length === 0) return 0;
    const total = this.learningSkills.reduce((sum, skill) => sum + skill.progress, 0);
    return Math.round(total / this.learningSkills.length);
  }

  // Responsive Helper
  shouldShowCategories(): boolean {
    return !this.isMobileView && this.skillArr.length > 6;
  }

  // Skills nach Level gruppieren (für erweiterte Ansicht)
  getSkillsByLevel(level: string): Skill[] {
    return this.skillArr.filter(skill => skill.level === level);
  }

  // Filter-Methoden (für zukünftige Erweiterungen)
  filterSkillsByCategory(category: string): Skill[] {
    return this.skillArr.filter(skill => skill.category === category);
  }

  // Debug-Methoden (können in Produktion entfernt werden)
  logSkillsInfo(): void {
    console.log('Total Skills:', this.getTotalSkillsCount());
    console.log('Learning Skills:', this.getLearningSkillsCount());
    console.log('Average Learning Progress:', this.getAverageProgress() + '%');
    console.log('Frontend Skills:', this.frontendSkills.length);
    console.log('Backend Skills:', this.backendSkills.length);
  }

  // Accessibility-Helpers
  getSkillAriaLabel(skill: Skill): string {
    return `${skill.name} - ${skill.level || 'intermediate'} level ${skill.category || 'general'} skill`;
  }

  getLearningSkillAriaLabel(skill: LearningSkill): string {
    return `${skill.name} - Currently learning, ${skill.progress}% progress`;
  }
}