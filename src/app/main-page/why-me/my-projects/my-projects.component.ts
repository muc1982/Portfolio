import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalService } from '../../global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MyProjectsMobileComponent } from "./my-projects-mobile/my-projects-mobile.component"; // <-- Wichtig: TranslateModule importieren

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  isCompleted: boolean;
  hasWorkingDemo: boolean;
  featured: boolean;
  category: string;
  createdDate: Date;
}

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule, MyProjectsMobileComponent], // <-- Hier TranslateModule hinzufügen
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private globalService = inject(GlobalService);

  // Projects data
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];

  // Filter and sorting options
  selectedCategory: string = 'all';
  sortBy: 'date' | 'title' | 'featured' = 'featured';
  showOnlyCompleted: boolean = true;

  // Loading and error states
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';

  // Available categories
  categories: string[] = ['all', 'web', 'mobile', 'desktop', 'api'];

  constructor() {}

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load projects from the global service
   */
private loadProjects(): void {
  this.isLoading = true;
  this.hasError = false;

  try {
    const rawProjects = this.globalService.getProjects() || [];

    this.allProjects = rawProjects.map(p => ({
      id: p.keyPrefix || '',
      title: p.name || '',
      description: p.transName || '',
      image: '',
      technologies: p.technologies || [],
      demoUrl: p.weburl || '',
      githubUrl: p.giturl || '',
      isCompleted: p.isCompleted,
      hasWorkingDemo: p.hasWorkingDemo,
      featured: false,
      category: 'web',
      createdDate: new Date()
    }));

    this.applyFilters();
    this.isLoading = false;

  } catch (error) {
    console.error('Error loading projects:', error);
    this.hasError = true;
    this.errorMessage = 'Failed to load projects. Please try again later.';
    this.isLoading = false;
  }
}

  /**
   * Apply filters and sorting to projects
   */
  private applyFilters(): void {
    let filtered = [...this.allProjects];

    // Filter by completion status
    if (this.showOnlyCompleted) {
      filtered = filtered.filter(project => 
        project.isCompleted && project.hasWorkingDemo
      );
    }

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(project => 
        project.category === this.selectedCategory
      );
    }

    // Sort projects
    filtered = this.sortProjects(filtered);

    this.filteredProjects = filtered;
  }

  /**
   * Sort projects based on selected criteria
   * @param projects - Projects to sort
   * @returns Sorted projects array
   */
  private sortProjects(projects: Project[]): Project[] {
    return projects.sort((a, b) => {
      switch (this.sortBy) {
        case 'featured':
          // Featured projects first, then by date
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        
        case 'date':
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        
        case 'title':
          return a.title.localeCompare(b.title);
        
        default:
          return 0;
      }
    });
  }

  /**
   * Validate if a URL is properly formatted and accessible
   * @param url - URL to validate
   * @returns boolean indicating if URL is valid
   */
  isValidUrl(url: string | undefined): boolean {
    if (!url || url.trim() === '') {
      return false;
    }

    try {
      const urlObj = new URL(url);
      
      // Check if protocol is http or https
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }

      // Check if hostname exists
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return false;
      }

      // Additional checks for common invalid patterns
      const invalidPatterns = [
        'localhost',
        '127.0.0.1',
        'example.com',
        'test.com',
        'placeholder',
        'coming-soon'
      ];

      const hostname = urlObj.hostname.toLowerCase();
      if (invalidPatterns.some(pattern => hostname.includes(pattern))) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle category filter change
   * @param category - Selected category
   */
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  /**
   * Handle sort option change
   * @param sortOption - Selected sort option
   */
  onSortChange(sortOption: 'date' | 'title' | 'featured'): void {
    this.sortBy = sortOption;
    this.applyFilters();
  }

  /**
   * Toggle showing only completed projects
   */
  toggleCompletedOnly(): void {
    this.showOnlyCompleted = !this.showOnlyCompleted;
    this.applyFilters();
  }

  /**
   * Get project count for current filters
   * @returns Number of filtered projects
   */
  getProjectCount(): number {
    return this.filteredProjects.length;
  }

  /**
   * Get total project count
   * @returns Total number of projects
   */
  getTotalProjectCount(): number {
    return this.allProjects.length;
  }

  /**
   * Check if a project has a working demo
   * @param project - Project to check
   * @returns boolean
   */
  hasWorkingDemo(project: Project): boolean {
    return project.hasWorkingDemo && this.isValidUrl(project.demoUrl);
  }

  /**
   * Check if a project has a GitHub repository
   * @param project - Project to check
   * @returns boolean
   */
  hasGithubRepo(project: Project): boolean {
    return this.isValidUrl(project.githubUrl);
  }

  /**
   * Open project demo in new tab
   * @param project - Project to open
   */
  openDemo(project: Project): void {
    if (this.hasWorkingDemo(project) && project.demoUrl) {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Open project GitHub repository in new tab
   * @param project - Project to open
   */
  openGithub(project: Project): void {
    if (this.hasGithubRepo(project) && project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Get formatted date string
   * @param date - Date to format
   * @returns Formatted date string
   */
  getFormattedDate(date: Date): string {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long'
    }).format(new Date(date));
  }

  /**
   * Get technology badge color
   * @param tech - Technology name
   * @returns CSS class for technology badge
   */
  getTechBadgeColor(tech: string): string {
    const techColors: { [key: string]: string } = {
      'Angular': 'tech-angular',
      'React': 'tech-react',
      'Vue': 'tech-vue',
      'TypeScript': 'tech-typescript',
      'JavaScript': 'tech-javascript',
      'Node.js': 'tech-nodejs',
      'Python': 'tech-python',
      'Java': 'tech-java',
      'C#': 'tech-csharp',
      'PHP': 'tech-php',
      'CSS': 'tech-css',
      'SCSS': 'tech-scss',
      'HTML': 'tech-html'
    };

    return techColors[tech] || 'tech-default';
  }

  /**
   * Handle project card click
   * @param project - Clicked project
   */
  onProjectClick(project: Project): void {
    // If project has a demo, open it; otherwise open GitHub
    if (this.hasWorkingDemo(project)) {
      this.openDemo(project);
    } else if (this.hasGithubRepo(project)) {
      this.openGithub(project);
    }
  }

  /**
   * Retry loading projects
   */
  retryLoading(): void {
    this.loadProjects();
  }

  /**
   * Track by function for ngFor optimization
   * @param index - Array index
   * @param project - Project item
   * @returns Unique identifier
   */
  trackByProject(index: number, project: Project): string {
    return project.id;
  }
}

