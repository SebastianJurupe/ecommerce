import { Component, Injector } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';

@Component({
  selector: 'app-register-base',
  templateUrl: 'register-base.component.html',
  styleUrls: ['register-base.component.scss'],
  host: { 'app.register-base': 'true' }
})
export class RegisterBaseComponent extends ViewComponent {


  emailValid = false;
  inputType: 'password' | 'text' = 'password';
  isLoading: boolean = false;
  nameValid = false;
  passwordValid = false;
  registrationButtonDisabled = true;
  showPasswordInstructions = false;
  toolbar: AppTabService;
  complete: boolean = false
  registerForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
    device: ''
  };

  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };

  constructor(_injector: Injector,) {
    super(_injector);

    this.toolbar = _injector.get(AppTabService);
  }

  ionViewWillEnter(): void {
    this.toolbar.hide();
  }

  onToggleInput(newType: 'password' | 'text') {
    this.inputType = newType;
  }
  handleInputComplete(event: any) {
    this.complete = event

  }
  onValidateName() {
    this.nameValid = /^[a-zA-Z\s]+$/.test(this.registerForm.name);
    this.checkFormValidity();
  }

  onValidateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.emailValid = emailRegex.test(this.registerForm.email);
    this.checkFormValidity();
  }

  onCheckPasswordRequirements() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!.@$?_-])[A-Za-z\d!.@$?_-]{8,}$/;
    const { password } = this.registerForm;
    this.passwordValid = passwordRegex.test(password) && password.trim() !== '';
    this.showPasswordInstructions = !this.passwordValid && password.trim() !== '';
    this.checkFormValidity();
  }

  onSetPhoneValue(phoneNumber: string) {
    this.registerForm.phone = phoneNumber;
    this.checkFormValidity()
  }

  checkFormValidity() {
    this.registrationButtonDisabled = !(this.nameValid && this.emailValid && this.passwordValid && this.complete);
  }

  validate(): boolean {
    if (this.nameValid && this.emailValid && this.passwordValid && this.complete) {
      return false
    }
    return true
  }
}
