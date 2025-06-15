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
  selector: 'app-contact-me',
  standalone: true,
  imports: [
    TranslateModule, 
    CommonModule, 
    RouterLink, 
    RouterLinkActive, 
    FormsModule,
  ],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.scss'
})
export class ContactMeComponent {
  @Input() scrollContainer!: HTMLElement;
  isChecked: boolean = false;
  
  nameValid: boolean = true;
  emailValid: boolean = true;
  emailInvalidMsg: string = 'contact.emailrequired';
  msgValid: boolean = true;
  isShowingSuccessMsg = false;
  
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
  
  contact: Contact = {name:'', email:'', msg: ''};

  clickCb() {
    this.isChecked = !this.isChecked;
  }

  onSumbmit(myForm: NgForm) {
    const isValid = this.validateAllFields();
    if (!isValid) {
      this.markFieldsAsTouched(myForm);
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

  private validateAllFields(): boolean {
    this.validateName();
    this.validateEmail();
    this.validateMessage();
    
    return this.nameValid && this.emailValid && this.msgValid && this.isChecked;
  }

  private validateName(): void {
    const name = this.contact.name.trim();
    this.nameValid = this.namePattern.test(name);
    if (!this.nameValid) {
      this.contact.name = '';
    }
  }

  private validateEmail(): void {
    const email = this.contact.email.trim();
    if (email.length === 0) {
      this.emailValid = false;
      this.emailInvalidMsg = 'contact.emailrequired';
    } else if (!this.emailPattern.test(email)) {
      this.emailValid = false;
      this.emailInvalidMsg = 'contact.emailinvalid';
    } else {
      this.emailValid = true;
    }
  }

  private validateMessage(): void {
    const msg = this.contact.msg.trim();
    this.msgValid = msg.length >= this.msgMinLength && msg.length <= this.msgMaxLength;
    if (!this.msgValid) {
      this.contact.msg = '';
    }
  }

  private markFieldsAsTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
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

  reset(myForm: NgForm) {
    this.clickCb();
    this.contact.name = '';
    this.contact.email = '';
    this.contact.msg = '';
    this.isShowingSuccessMsg = true;
    myForm.resetForm();
    setTimeout(() => {
      this.isShowingSuccessMsg = false;
    }, 3000);
  }

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

  isFormValid(): boolean {
    return this.contact.name.length > 0 && 
           this.contact.email.length > 0 && 
           this.contact.msg.length > 0 && 
           this.isChecked;
  }
}