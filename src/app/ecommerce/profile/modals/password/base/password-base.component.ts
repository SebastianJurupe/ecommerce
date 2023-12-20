import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';

@Component({
  templateUrl: 'password-base.component.html',
  styleUrls: ['password-base.component.scss'],
  host: { 'app.password-base': 'true' }
})
export class PasswordBaseComponent extends ViewComponent {

  private _profileServiceProxy: ProfileServiceProxy;

  arePasswordsMatching = false;
  confirmPassword: string = '';
  confirmPasswordType: 'password' | 'text' = 'password';
  currentPassword: string = '';
  currentPasswordType: 'password' | 'text' = 'password';
  isPasswordValid = false;
  newPassword: string = '';
  newPasswordType: 'password' | 'text' = 'password';
  isLoading: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
  }


  submit() {
    this.isLoading = true;

    this._profileServiceProxy.updatePassword(
      this.currentPassword,
      this.newPassword,
      this.confirmPassword
    ).subscribe({
      next: async (res) => {
        this.isLoading = false;
        this.dialog.dismiss();
        await this.notify.success(res.message, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        throw new Error(error);
      }
    });
  }

  toggleInput(field: 'currentPassword' | 'newPassword' | 'confirmPassword') {
    if (field === 'currentPassword') {
      this.currentPasswordType = this.currentPasswordType === 'password' ? 'text' : 'password';
    } else if (field === 'newPassword') {
      this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password';
    }
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*+?&-])[A-Za-z\d@$!%*+?&-]{8,}$/;
    return passwordRegex.test(password);
  }


  checkPasswordsMatch() {
    this.arePasswordsMatching = this.newPassword === this.confirmPassword;
    this.isPasswordValid = this.validatePassword(this.newPassword);
  }
}