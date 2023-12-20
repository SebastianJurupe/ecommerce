import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';

@Component({
  selector: 'app-reset-password-base',
  templateUrl: 'reset-password-base.component.html',
  styleUrls: ['reset-password-base.component.scss'],
  host: { 'app.reset-password-base': 'true' }
})
export class ResetPasswordBaseComponent extends ViewComponent implements OnInit {

  private _accountServiceProxy: AccountServiceProxy;
  private _activatedRoute: ActivatedRoute;
  _toolbar: AppTabService;

  @Input() codeTablet: string = '';
  @Input() emailTablet: string = '';
  @Input() tablet: boolean = false;

  code: string = '';
  email: string = '';
  isLoading: boolean = false;
  newPassword: string = '';
  newPasswordInputType: 'password' | 'text' = 'password';
  newPasswordValid = false;
  passwordRequirementsMet = false;
  repeatedPassword: string = '';
  repeatedPasswordInputType: 'password' | 'text' = 'password';
  repeatedPasswordValid = false;
  showNewPasswordInstructions = false;
  showRepeatedPasswordInstructions = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    const { email, code } = this._activatedRoute.snapshot.params;

    this.email = email;
    this.code = code;
    if (this.tablet) {
      this.email = this.emailTablet;
      this.code = this.codeTablet;
    }
  }

  ionViewWillEnter(): void {
    this._toolbar.hide();
  }

  onCheckNewPasswordRequirements() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!.@$?_-])[A-Za-z\d!.@$?_-]{8,}$/;
    this.newPasswordValid = passwordRegex.test(this.newPassword) && this.newPassword.trim() !== '';
    this.showNewPasswordInstructions = !this.newPasswordValid;

    this.passwordRequirementsMet = this.newPasswordValid && this.repeatedPasswordValid;
  }

  onCheckRepeatedPassword() {
    this.repeatedPasswordValid = this.repeatedPassword === this.newPassword;
    this.showRepeatedPasswordInstructions = !this.repeatedPasswordValid;

    this.passwordRequirementsMet = this.newPasswordValid && this.repeatedPasswordValid;
  }

  onToggleNewPasswordInputType(newType: 'password' | 'text') {
    this.newPasswordInputType = newType;
  }

  onToggleRepeatedPasswordInputType(newType: 'password' | 'text') {
    this.repeatedPasswordInputType = newType;
  }

  onSubmit(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this.isLoading = true;
      this._accountServiceProxy.updatePasswordResetPassword(
        this.email,
        this.code,
        this.newPassword,
        this.repeatedPassword
      ).subscribe({
        next: () => {
          this.isLoading = true;
          resolve(true);
        },
        error: (err: ApiException) => {
          this.isLoading = false;
          this.message.exception(err);
          reject(false);
        }
      });
    });
  }
}
