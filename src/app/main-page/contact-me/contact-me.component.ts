import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Contact {
  name: string,
  email: string,
  msg: string,
}

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.scss'
})
export class ContactMeComponent {
  @Input() scrollContainer?: HTMLElement;
  isChecked: boolean = false;

  // KORRIGIERT: Fehlende Properties hinzugefügt
  nameBlurred = false;
  emailBlurred = false;
  msgBlurred = false;

  nameValid: boolean = true;
  emailValid: boolean = true;
  emailInvalidMsg: string = 'contact.emailrequired';
  msgValid: boolean = true;
  isShowingSuccessMsg = false;
  isShowingDetailedSuccess = false; // Für die detaillierte Erfolgsmeldung

  readonly namePattern = /^[a-zA-ZäöüÄÖÜß\s]{2,50}$/;
  readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  readonly msgMinLength = 10;
  readonly msgMaxLength = 500;

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

  clickCb() {
    this.isChecked = !this.isChecked;
  }

  // KORRIGIERT: Methodenname von onSumbmit zu onSubmit
  onSubmit(myForm: NgForm) {
    console.log('Submit called with form valid:', myForm.valid);
    console.log('Contact data:', this.contact);
    console.log('Checkbox checked:', this.isChecked);

    const isValid = this.validateAllFieldsOnSubmit();
    console.log('All fields valid:', isValid);

    if (!isValid) {
      console.log('Form validation failed');
      return;
    }

    console.log('Sending email...');
    this.sendEmail(myForm);
  }

  // KORRIGIERT: Neue Validation-Methoden hinzugefügt
  private validateAllFieldsOnSubmit(): boolean {
    this.nameBlurred = true;
    this.emailBlurred = true;
    this.msgBlurred = true;

    this.validateName();
    this.validateEmail();
    this.validateMessage();

    return this.nameValid && this.emailValid && this.msgValid && this.isChecked;
  }

  validateName(): void {
    this.nameBlurred = true;
    const name = this.contact.name.trim();
    this.nameValid = this.namePattern.test(name);
    console.log('Name validation:', name, this.nameValid);
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
    this.msgValid = msg.length >= this.msgMinLength && msg.length <= this.msgMaxLength;
    console.log('Message validation:', msg.length, this.msgValid);
    if (!this.msgValid) {
      this.contact.msg = '';
    }
  }

  private checkMail(): void {
    const email = this.contact.email.trim();
    console.log('Email validation:', email);

    if (email.length === 0) {
      this.emailValid = false;
      this.emailInvalidMsg = 'contact.emailrequired';
    } else if (!this.emailPattern.test(email)) {
      this.emailValid = false;
      // Spezifische Fehlermeldungen für häufige Tippfehler
      if (email.includes(',')) {
        this.emailInvalidMsg = 'contact.emailcommaerror';
      } else if (!email.includes('@')) {
        this.emailInvalidMsg = 'contact.emailmissingat';
      } else if (!email.includes('.')) {
        this.emailInvalidMsg = 'contact.emailmissingdot';
      } else if (email.split('@').length > 2) {
        this.emailInvalidMsg = 'contact.emailmultipleat';
      } else {
        this.emailInvalidMsg = 'contact.emailinvalid';
      }
    } else {
      this.emailValid = true;
    }
    console.log('Email valid:', this.emailValid);
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

  // KORRIGIERT: Separate sendEmail Methode
  private sendEmail(myForm: NgForm): void {
    console.log('Attempting to send email to:', this.post.endPoint);

    this.http.post(this.post.endPoint, this.post.body(this.contact), this.post.options)
      .subscribe({
        next: (response: any) => {
          console.log('E-Mail erfolgreich versendet via Formspree:', response);
          this.reset(myForm);
        },
        error: (error) => {
          console.error('Fehler beim Versenden der E-Mail:', error);
          this.handleEmailError(error);
        },
        complete: () => {
          console.log('E-Mail-Versand abgeschlossen');
        }
      });
  }

  private handleEmailError(error: any) {
    console.error('Fehler beim Versenden der E-Mail:', error);
    // Fallback zu mailto
    this.sendEmailFallback();
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

  // KORRIGIERT: showSuccessMessage() wird aufgerufen
  reset(myForm: NgForm) {
    if (this.isChecked) {
      this.clickCb(); // Checkbox deaktivieren
    }
    this.resetContactData();
    this.resetValidationStates();
    this.showSuccessMessage(); // KORRIGIERT: Diese Zeile war fehlend!
    myForm.resetForm();
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
    console.log('Showing success message');
    this.isShowingDetailedSuccess = true;
    setTimeout(() => {
      this.isShowingDetailedSuccess = false;
      console.log('Success message hidden');
    }, 5000);
  }

  isFormValid(): boolean {
    const valid = this.contact.name.length > 0 &&
      this.contact.email.length > 0 &&
      this.contact.msg.length > 0 &&
      this.nameValid &&
      this.emailValid &&
      this.msgValid;

    console.log('Form validity check:', {
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