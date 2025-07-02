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

  onSumbmit(myForm: NgForm) {
    const isValid = this.validateAllFieldsOnSubmit();
    if (!isValid) {
      return;
    }

    this.http.post(this.post.endPoint, this.post.body(this.contact), this.post.options)
      .subscribe({
        next: (response: any) => {
          console.log('E-Mail erfolgreich versendet via Formspree:', response);
          this.reset(myForm);
        },
        error: (error) => this.handleEmailError(error),
        complete: () => console.log('E-Mail-Versand abgeschlossen')
      });
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
    if (!this.msgValid) {
      this.contact.msg = '';
    }
  }

  private checkMail(): void {
    const email = this.contact.email.trim();
    
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

  // KORRIGIERT: Alte Methoden angepasst für Kompatibilität
  onNameChange() {
    if (this.contact.name.length > 0) {
      this.validateName();
    }
  }

  onEmailChange() {
    if (this.contact.email.length > 0) {
      this.validateEmail();
    }
  }

  onMessageChange() {
    if (this.contact.msg.length > 0) {
      this.validateMessage();
    }
  }

  private handleEmailError(error: any) {
    console.error('Fehler beim Versenden der E-Mail:', error);
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
    this.clickCb();
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
    this.isShowingDetailedSuccess = true;
    setTimeout(() => {
      this.isShowingDetailedSuccess = false;
    }, 5000);
  }

  isFormValid(): boolean {
    return this.contact.name.length > 0 &&
      this.contact.email.length > 0 &&
      this.contact.msg.length > 0 &&
      this.nameValid &&
      this.emailValid &&
      this.msgValid;
  }
}