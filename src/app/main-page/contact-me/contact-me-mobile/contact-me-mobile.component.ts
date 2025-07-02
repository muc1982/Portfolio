import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Contact {
  name: string,
  email: string,
  msg: string,
}

@Component({
  selector: 'app-contact-me-mobile',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './contact-me-mobile.component.html',
  styleUrl: './contact-me-mobile.component.scss'
})
export class ContactMeMobileComponent {
  @Input() scrollContainer?: HTMLElement;
  isChecked: boolean = false;
  nameValid: boolean = true;
  emailValid: boolean = true;
  emailInvalidMsg: string = 'contact.emailrequired';
  msgValid: boolean = true;
  isShowingSuccessMsg = false;
  isShowingDetailedSuccess = false; // Neue detaillierte Erfolgsmeldung
  nameBlurred = false;
  emailBlurred = false;
  msgBlurred = false;

  readonly namePattern = /^[a-zA-ZäöüÄÖÜß\s]{2,50}$/;
  readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // KORRIGIERT: Funktionierender Formspree Endpoint
  post = {
    endPoint: 'https://formspree.io/f/mldngvlb',
    body: (payload: any) => {
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('email', payload.email);
      formData.append('message', payload.msg);
      formData.append('_subject', 'Portfolio Kontakt von ' + payload.name);
      return formData;
    },
    options: {
      headers: {
        'Accept': 'application/json'
      },
    },
  }

  http = inject(HttpClient);

  contact: Contact = { name: '', email: '', msg: '' };

  constructor() { }

  clickCb() {
    this.isChecked = !this.isChecked;
  }

  // KORRIGIERT: Methodenname von onSumbmit zu onSubmit
  onSubmit(myForm: NgForm) {
    console.log('[MOBILE] Submit called with form valid:', myForm.valid);
    console.log('[MOBILE] Contact data:', this.contact);
    console.log('[MOBILE] Checkbox checked:', this.isChecked);
    
    const isValid = this.validateAllFieldsOnSubmit();
    console.log('[MOBILE] All fields valid:', isValid);
    
    if (isValid) {
      console.log('[MOBILE] Sending email...');
      this.sendEmail(myForm);
    } else {
      console.log('[MOBILE] Form validation failed');
    }
  }

  private validateAllFieldsOnSubmit(): boolean {
    this.nameBlurred = true;
    this.emailBlurred = true;
    this.msgBlurred = true;

    this.validateName();
    this.validateEmail();
    this.validateMessage();

    return this.nameValid && this.emailValid && this.msgValid && this.isChecked;
  }

  // KORRIGIERT: Separate sendEmail Methode
  private sendEmail(myForm: NgForm): void {
    console.log('[MOBILE] Attempting to send email to:', this.post.endPoint);
    
    this.http.post(this.post.endPoint, this.post.body(this.contact), this.post.options)
      .subscribe({
        next: (response: any) => {
          console.log('[MOBILE] E-Mail erfolgreich versendet via Formspree:', response);
          this.reset(myForm);
        },
        error: (error) => {
          console.error('[MOBILE] Fehler beim Versenden der E-Mail:', error);
          this.sendEmailFallback();
        },
        complete: () => {
          console.log('[MOBILE] E-Mail-Versand abgeschlossen');
        },
      });
  }

  sendEmailFallback() {
    const subject = encodeURIComponent('Portfolio Kontakt');
    const body = encodeURIComponent(
      `Name: ${this.contact.name}\n` +
      `E-Mail: ${this.contact.email}\n\n` +
      `Nachricht:\n${this.contact.msg}`
    );

    const mailtoLink = `mailto:info@sun-dev.de?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }

  reset(myForm: NgForm) {
    if (this.isChecked) {
      this.clickCb();
    }
    this.resetContactData();
    this.resetValidationStates();
    this.showSuccessMessage(); // KORRIGIERT: Diese Zeile war fehlend!
  }

  private resetContactData(): void {
    this.contact.name = '';
    this.contact.email = '';
    this.contact.msg = '';
  }

  private resetValidationStates(): void {
    this.nameBlurred = false;
    this.emailBlurred = false;
    this.msgBlurred = false;
    this.nameValid = true;
    this.emailValid = true;
    this.msgValid = true;
  }

  private showSuccessMessage(): void {
    console.log('[MOBILE] Showing success message');
    this.isShowingDetailedSuccess = true;
    setTimeout(() => {
      this.isShowingDetailedSuccess = false;
      console.log('[MOBILE] Success message hidden');
    }, 5000);
  }

  validateName(): void {
    this.nameBlurred = true;
    const name = this.contact.name.trim();
    this.nameValid = this.namePattern.test(name);
    console.log('[MOBILE] Name validation:', name, this.nameValid);
    if (!this.nameValid) {
      this.contact.name = '';
    }
  }

  validateEmail(): void {
    this.emailBlurred = true;
    this.checkMail();
  }

  validateMessage(): void {
    this.msgBlurred = true;
    const msg = this.contact.msg.trim();
    this.msgValid = msg.length >= 10 && msg.length <= 500;
    console.log('[MOBILE] Message validation:', msg.length, this.msgValid);
    if (!this.msgValid) {
      this.contact.msg = '';
    }
  }

  private checkMail(): void {
    const email = this.contact.email.trim();
    console.log('[MOBILE] Email validation:', email);

    if (email.length <= 0) {
      this.emailValid = false;
      this.emailInvalidMsg = 'contact.emailrequired';
      this.contact.email = '';
    } else if (!this.emailPattern.test(email)) {
      this.emailValid = false;
      // Spezifische Fehlermeldungen für häufige Tippfehler
      if (email.includes(',')) {
        this.emailInvalidMsg = 'contact.emailcommaerror'; // "Bitte verwenden Sie einen Punkt (.) statt Komma"
      } else if (!email.includes('@')) {
        this.emailInvalidMsg = 'contact.emailmissingat'; // "@ Zeichen fehlt in der E-Mail-Adresse"
      } else if (!email.includes('.')) {
        this.emailInvalidMsg = 'contact.emailmissingdot'; // "Punkt (.) fehlt in der E-Mail-Adresse"
      } else if (email.split('@').length > 2) {
        this.emailInvalidMsg = 'contact.emailmultipleat'; // "Zu viele @ Zeichen in der E-Mail"
      } else {
        this.emailInvalidMsg = 'contact.emailinvalid'; // "Ungültige E-Mail-Adresse"
      }
      this.contact.email = '';
    } else {
      this.emailValid = true;
    }
    console.log('[MOBILE] Email valid:', this.emailValid);
  }

  onNameFocus(): void {
    this.nameValid = true;
  }

  onEmailFocus(): void {
    this.emailValid = true;
  }

  onMessageFocus(): void {
    this.msgValid = true;
  }

  isFormValid(): boolean {
    const valid = this.contact.name.length > 0 &&
           this.contact.email.length > 0 &&
           this.contact.msg.length > 0 &&
           this.nameValid &&
           this.emailValid &&
           this.msgValid;
    
    console.log('[MOBILE] Form validity check:', {
      name: this.contact.name.length > 0,
      email: this.contact.email.length > 0,
      message: this.contact.msg.length > 0,
      nameValid: this.nameValid,
      emailValid: this.emailValid,
      msgValid: this.msgValid,
      overall: valid
    });
    
    return valid;
  }
}