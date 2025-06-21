import { CommonModule } from "@angular/common"
import { Component, inject, Input } from "@angular/core"
import { TranslateModule } from "@ngx-translate/core"
import { Router } from "@angular/router"
import { FormsModule, type NgForm } from "@angular/forms"
import { HttpClient } from "@angular/common/http"

interface Contact {
  name: string
  email: string
  msg: string
}

@Component({
  selector: "app-contact-me",
  standalone: true,
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: "./contact-me.component.html",
  styleUrl: "./contact-me.component.scss",
})
export class ContactMeComponent {
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
  readonly msgMinLength = 10
  readonly msgMaxLength = 500

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

  clickCb() {
    this.isChecked = !this.isChecked
  }

  // Privacy Policy öffnen ohne Router
  openPrivacyPolicy(event: Event) {
    event.preventDefault()
    // Versuche Router, falls verfügbar
    try {
      this.router.navigate(["/private-policy"])
    } catch (error) {
      // Fallback: Öffne in neuem Tab
      window.open("/private-policy.html", "_blank")
    }
  }

  onSumbmit(myForm: NgForm) {
    if (!this.validateAndPrepareForm(myForm)) {
      return
    }
    this.sendFormData(myForm)
  }

  private validateAndPrepareForm(myForm: NgForm): boolean {
    this.nameBlurred = true
    this.emailBlurred = true
    this.msgBlurred = true

    const isValid = this.validateAllFields()
    if (!isValid) {
      this.markFieldsAsTouched(myForm)
      return false
    }
    return true
  }

  private sendFormData(myForm: NgForm): void {
    this.isSending = true
    console.log("🖥️ Desktop: Starte Mail-Versand...", this.contact)

    this.http.post(this.post.endPoint, this.post.body(this.contact), this.post.options).subscribe({
      next: (response: any) => {
        console.log("🖥️ ✅ Desktop: E-Mail erfolgreich versendet:", response)
        this.isSending = false
        this.reset(myForm)
      },
      error: (error) => {
        console.error("🖥️ ❌ Desktop: Fehler beim Mail-Versand:", error)
        this.isSending = false
        this.handleEmailError(error)
      },
      complete: () => {
        console.log("🖥️ 📧 Desktop: Mail-Versand-Prozess abgeschlossen")
      },
    })
  }

  private validateAllFields(): boolean {
    this.validateName()
    this.validateEmail()
    this.validateMessage()

    return this.nameValid && this.emailValid && this.msgValid && this.isChecked
  }

  private validateName(): void {
    const name = (this.contact.name || "").trim()
    this.nameValid = this.namePattern.test(name)
  }

  private validateEmail(): void {
    const email = (this.contact.email || "").trim()

    if (email.length === 0) {
      this.emailValid = false
      this.emailInvalidMsg = "contact.emailrequired"
      return
    }

    // SPEZIELLE KOMMA-PRÜFUNG
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

  private validateMessage(): void {
    const msg = (this.contact.msg || "").trim()
    this.msgValid = msg.length >= this.msgMinLength && msg.length <= this.msgMaxLength
  }

  private markFieldsAsTouched(form: NgForm): void {
    Object.keys(form.controls).forEach((key) => {
      form.controls[key].markAsTouched()
    })
  }

  private handleEmailError(error: any) {
    console.error("Fehler beim Versenden der E-Mail:", error)
    this.sendEmailFallback()
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
    console.log("🖥️ 🔄 Desktop: Reset wird ausgeführt...")

    if (this.isChecked) {
      this.clickCb()
    }

    this.resetContactData()
    this.resetValidationStates()
    myForm.resetForm()

    // Erfolgsmeldung anzeigen
    this.isShowingDetailedSuccess = true
    console.log("🖥️ ✅ Desktop: Erfolgsmeldung wird angezeigt")

    setTimeout(() => {
      this.isShowingDetailedSuccess = false
      console.log("🖥️ ✅ Desktop: Erfolgsmeldung ausgeblendet")
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

  onNameBlur() {
    this.nameBlurred = true
    this.validateName()
  }

  onEmailBlur() {
    this.emailBlurred = true
    this.validateEmail()
  }

  onMessageBlur() {
    this.msgBlurred = true
    this.validateMessage()
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
      this.isChecked
    )
  }
}
