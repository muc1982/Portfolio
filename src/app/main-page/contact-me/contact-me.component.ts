import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // <-- TranslateModule hier importieren
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MyProjectsMobileComponent } from "../my-projects/my-projects-mobile/my-projects-mobile.component"; // <-- CommonModule ist oft nützlich

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact-me',
  standalone: true, // <-- Dies ist wichtig für Standalone-Komponenten
  imports: [FormsModule, CommonModule, TranslateModule], // <-- Hier FormsModule, CommonModule und TranslateModule hinzufügen
  templateUrl: './contact-me.component.html',
  styleUrls: ['./contact-me.component.scss']
})
export class ContactMeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Form data model
  formData: ContactFormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  // Form state
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: boolean = false;

  constructor(
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Initialize component
    this.resetForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle form submission
   * @param form - Angular form reference
   */
  onSubmit(form: NgForm): void {
    if (form.invalid || this.isSubmitting) {
      this.markAllFieldsAsTouched(form);
      return;
    }

    this.isSubmitting = true;
    this.submitError = false;
    this.submitSuccess = false;

    // Simulate form submission (replace with actual service call)
    this.submitContactForm(this.formData)
      .then(() => {
        this.submitSuccess = true;
        this.resetForm();
        form.resetForm();
        
        // Show success message for 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        this.submitError = true;
        
        // Hide error message after 5 seconds
        setTimeout(() => {
          this.submitError = false;
        }, 5000);
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  /**
   * Submit contact form data
   * @param data - Form data to submit
   * @returns Promise<void>
   */
  private async submitContactForm(data: ContactFormData): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically make an HTTP request to your backend
    // Example:
    // return this.http.post('/api/contact', data).toPromise();
    
    // For now, we'll simulate success
    console.log('Contact form submitted:', data);
    
    // Simulate occasional errors for testing
    if (Math.random() < 0.1) {
      throw new Error('Simulated submission error');
    }
  }

  /**
   * Reset form data to initial state
   */
  private resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  /**
   * Mark all form fields as touched to show validation errors
   * @param form - Angular form reference
   */
  private markAllFieldsAsTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  /**
   * Check if a specific field has errors and is touched
   * @param form - Angular form reference
   * @param fieldName - Name of the field to check
   * @returns boolean
   */
  hasFieldError(form: NgForm, fieldName: string): boolean {
    const field = form.controls[fieldName];
    return field ? field.invalid && field.touched : false;
  }

  /**
   * Get error message for a specific field
   * @param form - Angular form reference
   * @param fieldName - Name of the field
   * @returns string
   */
  getFieldErrorMessage(form: NgForm, fieldName: string): string {
    const field = form.controls[fieldName];
    if (!field || !field.errors) {
      return '';
    }

    // Return appropriate error message based on validation error
    if (field.errors['required']) {
      return this.translate.instant(`contact.${fieldName}Required`);
    }
    if (field.errors['email']) {
      return this.translate.instant('contact.emailInvalid');
    }
    if (field.errors['minlength']) {
      const requiredLength = field.errors['minlength'].requiredLength;
      return this.translate.instant('contact.minLengthError', { length: requiredLength });
    }

    return this.translate.instant('contact.fieldError');
  }

  /**
   * Handle input field changes
   * @param field - Field name
   * @param value - New value
   */
  onFieldChange(field: keyof ContactFormData, value: string): void {
    this.formData[field] = value;
    
    // Clear success/error states when user starts typing
    if (this.submitSuccess || this.submitError) {
      this.submitSuccess = false;
      this.submitError = false;
    }
  }

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns boolean
   */
isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

  /**
   * Get current form validation status
   * @param form - Angular form reference
   * @returns boolean
   */
isFormValid(form: NgForm): boolean {
  return form.valid === true &&
         this.formData.name.trim().length >= 2 &&
         this.formData.subject.trim().length >= 3 &&
         this.formData.message.trim().length >= 10 &&
         this.isValidEmail(this.formData.email);
}

  /**
   * Handle form reset
   * @param form - Angular form reference
   */
  onReset(form: NgForm): void {
    form.resetForm();
    this.resetForm();
    this.submitSuccess = false;
    this.submitError = false;
  }
}

