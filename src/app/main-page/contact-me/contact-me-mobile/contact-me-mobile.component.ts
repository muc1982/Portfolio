import { CommonModule } from "@angular/common"
import { Component, inject, Input } from "@angular/core"
import { TranslateModule } from "@ngx-translate/core"
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { HttpClient } from "@angular/common/http"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-contact-me-mobile",
  standalone: true,
  imports: [TranslateModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./contact-me-mobile.component.html",
  styleUrl: "./contact-me-mobile.component.scss",
})
export class ContactMeMobileComponent {
  @Input() scrollContainer?: HTMLElement

  // Reactive Form
  contactForm: FormGroup;

  // Template Properties
  submitted = false;
  isShowingDetailedSuccess = false;
  isFadingOut = false;

  // Status-Properties
  isSending = false
  isSuccess = false

  // Validation Patterns
  readonly namePattern = /^[a-zA-ZäöüÄÖÜß\s]{2,50}$/
  readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // HTTP Client
  private http = inject(HttpClient)
  private fb = inject(FormBuilder)

  // Formspree Configuration
  private readonly formspreeEndpoint = "https://formspree.io/f/mldngvlb"

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(this.namePattern)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      privacy: [false, [Validators.requiredTrue]]
    });
  }

  // Getter für Template
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }
  get privacy() { return this.contactForm.get('privacy'); }

  // Validation Check Methods
  get nameValid(): boolean {
    return this.name?.valid || false;
  }

  get emailValid(): boolean {
    return this.email?.valid || false;
  }

  get msgValid(): boolean {
    return this.message?.valid || false;
  }

  get isChecked(): boolean {
    return this.privacy?.value || false;
  }

  get nameInvalid(): boolean {
    return (this.name?.invalid && (this.name?.dirty || this.name?.touched || this.submitted)) || false;
  }

  get emailInvalid(): boolean {
    return (this.email?.invalid && (this.email?.dirty || this.email?.touched || this.submitted)) || false;
  }

  get msgInvalid(): boolean {
    return (this.message?.invalid && (this.message?.dirty || this.message?.touched || this.submitted)) || false;
  }

  // Error Messages
  get emailInvalidMsg(): string {
    if (this.email?.hasError('required')) {
      return 'contact.emailrequired';
    }
    if (this.email?.hasError('email') || this.email?.hasError('pattern')) {
      const emailValue = this.email?.value || '';
      if (emailValue.includes(',')) {
        return 'contact.emailcommaerror';
      } else if (!emailValue.includes('@')) {
        return 'contact.emailmissingat';
      } else if (!emailValue.includes('.')) {
        return 'contact.emailmissingdot';
      } else {
        return 'contact.emailinvalid';
      }
    }
    return 'contact.emailrequired';
  }

  onSubmit() {
    this.submitted = true;

    // Markiere alle Felder als touched für Fehleranzeige
    this.contactForm.markAllAsTouched();

    if (!this.contactForm.valid) {
      return;
    }

    this.sendEmail();
  }

  clickCb(): void {
    this.privacy?.setValue(!this.privacy?.value);
  }

  private sendEmail() {
    this.isSending = true;
    this.isSuccess = false;

    const formData = new FormData();
    formData.append("name", this.contactForm.value.name);
    formData.append("email", this.contactForm.value.email);
    formData.append("message", this.contactForm.value.message);
    formData.append("_subject", `Portfolio Kontakt von ${this.contactForm.value.name}`);

    const options = {
      headers: {
        Accept: "application/json",
      },
    };

    this.http.post(this.formspreeEndpoint, formData, options).subscribe({
      next: (response: any) => {
        this.handleSuccess();
      },
      error: (error) => {
        this.handleError();
      },
      complete: () => {
        this.isSending = false;
      },
    });
  }

  private handleSuccess() {
    this.isSuccess = true;
    this.isShowingDetailedSuccess = true;
    this.isFadingOut = false;
    this.resetForm();

    // Nach 7 Sekunden Fade-Out starten
    setTimeout(() => {
      this.isFadingOut = true;
    }, 7000);

    // Nach 8 Sekunden komplett ausblenden
    setTimeout(() => {
      this.isSuccess = false;
      this.isShowingDetailedSuccess = false;
      this.isFadingOut = false;
    }, 8000);
  }

  private handleError() {
    const subject = encodeURIComponent("Portfolio Kontakt");
    const body = encodeURIComponent(
      `Name: ${this.contactForm.value.name}\n` +
      `E-Mail: ${this.contactForm.value.email}\n\n` +
      `Nachricht:\n${this.contactForm.value.message}`,
    );

    const mailtoLink = `mailto:info@sun-dev.de?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }

  private resetForm() {
    this.contactForm.reset();
    this.submitted = false;
  }

  // Focus handlers
  onNameFocus() {
    // Reactive Forms handhaben das automatisch
  }

  onEmailFocus() {
    // Reactive Forms handhaben das automatisch
  }

  onMessageFocus() {
    // Reactive Forms handhaben das automatisch
  }

  // Getter für Template
  get messageLength(): number {
    return this.message?.value?.length || 0;
  }

  get showCharacterCount(): boolean {
    return this.messageLength > 0;
  }

  // Template helper methods (für Rückwärtskompatibilität)
  isFormValid(): boolean {
    return this.contactForm.valid;
  }
}