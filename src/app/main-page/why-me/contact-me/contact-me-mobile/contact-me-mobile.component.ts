import { CommonModule } from "@angular/common"
import { Component, inject, Input } from "@angular/core"
import { TranslateModule } from "@ngx-translate/core"
import { RouterLink, RouterLinkActive, Router } from "@angular/router"
import { FormsModule, type NgForm } from "@angular/forms"
import { HttpClient } from "@angular/common/http"

interface Contact {
  name: string
  email: string
  msg: string
}

@Component({
  selector: "app-contact-me-mobile",
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: "./contact-me-mobile.component.html",
  styleUrl: "./contact-me-mobile.component.scss",
})
export class ContactMeMobileComponent {
  @Input() scrollContainer?: HTMLElement
  isChecked = false
  nameValid = true
  emailValid = true
  emailInvalidMsg = "contact.emailrequired"
  msgValid = true
  isShowingSuccessMsg = false
  isShowingDetailedSuccess = false
  isSending = false
  nameBlurred = false
  emailBlurred = false
  msgBlurred = false

  readonly namePattern = /^[a-zA-ZäöüÄÖÜß\s]{2,50}$/
  readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  post = {
    endPoint: "https://formspree.io/f/mldngvlb",
    body: (payload: any) => {
      const formData = new FormData()
      formData.append("name", payload.name)
      formData.append("email", payload.email)
      formData.append("message", payload.msg)
      formData.append("_subject", "Portfolio Kontakt von " + payload.name)
      return formData
    },
    options: {
      headers: {
        Accept: "application/json",
      },
    },
  }

  http = inject(HttpClient)
  router = inject(Router)

  // NULL-SAFE Initialisierung
  contact: Contact = {
    name: "",
    email: "",
    msg: "",
  }

  constructor() {}

  clickCb() {
    this.isChecked = !this.isChecked
  }

  // Privacy Policy öffnen ohne Router
  openPrivacyPolicy(event: Event) {
    event.preventDefault()
    try {
      this.router.navigate(["/private-policy"])
    } catch (error) {
      window.open("/private-policy.html", "_blank")
    }
  }

  onSumbmit(myForm: NgForm) {
    if (this.validateAllFieldsOnSubmit()) {
      this.sendFormData(myForm)
    }
  }

  private sendFormData(myForm: NgForm): void {
    this.isSending = true
    console.log("📱 Mobile: Starte Mail-Versand...", this.contact)

    this.http.post(this.post.endPoint, this.post.body(this.contact), this.post.options).subscribe({
      next: (response: any) => {
        console.log("📱 ✅ Mobile: E-Mail erfolgreich versendet:", response)
        this.isSending = false
        this.reset(myForm)
      },
      error: (error) => {
        console.error("📱 ❌ Mobile: Fehler beim Mail-Versand:", error)
        this.isSending = false
        this.sendEmailFallback()
      },
      complete: () => {
        console.log("📱 📧 Mobile: Mail-Versand-Prozess abgeschlossen")
      },
    })
  }

  private validateAllFieldsOnSubmit(): boolean {
    this.nameBlurred = true
    this.emailBlurred = true
    this.msgBlurred = true

    this.validateName()
    this.validateEmail()
    this.validateMessage()

    return this.nameValid && this.emailValid && this.msgValid && this.isChecked
  }

  sendEmailFallback() {
    const subject = encodeURIComponent("Portfolio Kontakt")
    const body = encodeURIComponent(
      `Name: ${this.contact.name || ""}\n` +
        `E-Mail: ${this.contact.email || ""}\n\n` +
        `Nachricht:\n${this.contact.msg || ""}`,
    )

    const mailtoLink = `mailto:info@sun-dev.de?subject=${subject}&body=${body}`
    window.location.href = mailtoLink
  }

  reset(myForm: NgForm) {
    console.log("📱 🔄 Mobile: Reset wird ausgeführt...")

    if (this.isChecked) {
      this.clickCb()
    }

    this.resetContactData()
    this.resetValidationStates()

    // Erfolgsmeldung anzeigen
    this.isShowingDetailedSuccess = true
    console.log("📱 ✅ Mobile: Erfolgsmeldung wird angezeigt")

    setTimeout(() => {
      this.isShowingDetailedSuccess = false
      console.log("📱 ✅ Mobile: Erfolgsmeldung ausgeblendet")
    }, 5000)
  }

  private resetContactData(): void {
    this.contact = { name: "", email: "", msg: "" }
  }

  private resetValidationStates(): void {
    this.nameBlurred = false
    this.emailBlurred = false
    this.msgBlurred = false
    this.nameValid = true
    this.emailValid = true
    this.msgValid = true
  }

  onNameBlur(): void {
    this.validateName()
  }

  onEmailBlur(): void {
    this.validateEmail()
  }

  onMessageBlur(): void {
    this.validateMessage()
  }

  validateName(): void {
    this.nameBlurred = true
    const name = (this.contact.name || "").trim()
    this.nameValid = this.namePattern.test(name)
  }

  validateEmail(): void {
    this.emailBlurred = true
    this.checkMail()
  }

  validateMessage(): void {
    this.msgBlurred = true
    const msg = (this.contact.msg || "").trim()
    this.msgValid = msg.length >= 10 && msg.length <= 500
  }

  private checkMail(): void {
    const email = (this.contact.email || "").trim()

    if (email.length <= 0) {
      this.emailValid = false
      this.emailInvalidMsg = "contact.emailrequired"
      return
    }

    // IDENTISCHE KOMMA-PRÜFUNG wie Desktop
    if (email.includes(",de") || email.includes(",com") || email.includes(",net") || email.includes(",org")) {
      this.emailValid = false
      this.emailInvalidMsg = "contact.emailcommaerror"
      return
    }

    if (email.includes(",")) {
      this.emailValid = false
      this.emailInvalidMsg = "contact.emailcommaerror"
      return
    }

    if (!this.emailPattern.test(email)) {
      this.emailValid = false
      if (!email.includes("@")) {
        this.emailInvalidMsg = "contact.emailmissingat"
      } else if (!email.includes(".")) {
        this.emailInvalidMsg = "contact.emailmissingdot"
      } else if (email.split("@").length > 2) {
        this.emailInvalidMsg = "contact.emailmultipleat"
      } else {
        this.emailInvalidMsg = "contact.emailinvalid"
      }
      return
    }

    this.emailValid = true
  }

  onNameFocus(): void {
    this.nameValid = true
  }

  onEmailFocus(): void {
    this.emailValid = true
  }

  onMessageFocus(): void {
    this.msgValid = true
  }

  isFormValid(): boolean {
    return (
      (this.contact.name || "").length > 0 &&
      (this.contact.email || "").length > 0 &&
      (this.contact.msg || "").length > 0 &&
      this.nameValid &&
      this.emailValid &&
      this.msgValid
    )
  }
}
