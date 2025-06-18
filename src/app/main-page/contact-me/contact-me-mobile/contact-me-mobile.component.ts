import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink, RouterLinkActive } from '@angular/router';
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
    RouterLinkActive,
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
  nameBlurred = false;
  emailBlurred = false;
  msgBlurred = false;

  readonly namePattern = /^[a-zA-ZäöüÄÖÜß\s]{2,50}$/;
  readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

  constructor() {}

  clickCb() {
    this.isChecked = !this.isChecked;
  }

  onSumbmit(myForm: NgForm) {
    const isValid = this.validateAllFieldsOnSubmit();
    if (isValid) {
      this.sendEmail(myForm);
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

  private sendEmail(myForm: NgForm): void {
    this.http.post(this.post.endPoint, this.post.body(this.contact), this.post.options)
      .subscribe({
        next: (response: any) => {
          console.log('E-Mail erfolgreich versendet via Formspree:', response);
          this.reset(myForm);
        },
        error: (error) => {
          console.error('Fehler beim Versenden der E-Mail:', error);
          this.sendEmailFallback();
        },
        complete: () => {
          console.log('E-Mail-Versand abgeschlossen');
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
    this.showSuccessMessage();
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
    this.isShowingSuccessMsg = true;
    setTimeout(() => {
      this.isShowingSuccessMsg = false;
    }, 3000);
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
    this.msgValid = msg.length >= 10 && msg.length <= 500;
    if (!this.msgValid) {
      this.contact.msg = '';
    }
  }

  private checkMail(): void {
    if (this.contact.email.trim().length <= 0) {
      this.emailValid = false;
      this.emailInvalidMsg = 'contact.emailrequired';
      this.contact.email = '';
    } else {
      this.emailValid = this.emailPattern.test(this.contact.email.trim());
      if (!this.emailValid) {
        this.emailInvalidMsg = 'contact.emailinvalid';
        this.contact.email = '';
      }
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

  isFormValid(): boolean {
    return this.contact.name.length > 0 && 
           this.contact.email.length > 0 && 
           this.contact.msg.length > 0 && 
           this.nameValid && 
           this.emailValid && 
           this.msgValid;
  }
}