import { AfterViewInit, Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ApiException, ViewComponent } from '@geor360/core';
import { IonInput } from '@ionic/angular';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';

@Component({
  templateUrl: 'verify-email-phone.component.html',
  styleUrls: ['verify-email-phone.component.scss']
})
export class VerifyEmailPhoneComponent extends ViewComponent implements OnInit, AfterViewInit {

  private _accountServiceProxy: AccountServiceProxy;

  @ViewChild('ionInput', { static: true }) ionInput!: IonInput;

  @Input() term: string = '';
  @Input() type!: 'phone' | 'email';

  inputModel = '';
  isMaxLengthReached = false;
  countdown: string = '0:30';
  isResendDisabled = true;
  countdownExpired = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
  }

  get title(): string {
    return this.type === 'phone'
      ? 'Valida tu número de celular'
      : 'Valida tu correo electrónico';
  }

  get subtitle(): string {
    return this.type === 'phone'
      ? 'Hemos enviado un código de validación al celular '
      : 'Hemos enviado un código de validación al correo ';
  }

  ngOnInit() {
    this.startCountdown();
  }

  ngAfterViewInit() {
    setTimeout(() => { this.ionInput.setFocus(); }, 500);
  }

  startCountdown() {
    let seconds = 30;
    const countdownInterval = setInterval(() => {
      seconds--;
      if (seconds >= 0) {
        this.countdown = `0:${seconds < 10 ? '0' : ''}${seconds}`;
        this.countdownExpired = false;
      } else {
        clearInterval(countdownInterval);
        this.countdownExpired = true;
        this.isResendDisabled = false;
      }
    }, 1000);
  }

  onInput(ev: any) {
    const value = ev.target!.value;
    const numericValue = value.replace(/[^0-9]+/g, '');
    const truncatedValue = numericValue.slice(0, 6);
    if (truncatedValue.length >= 6) {
      this.isMaxLengthReached = true;
    } else {
      this.isMaxLengthReached = false;
    }
    this.ionInput.value = this.inputModel = truncatedValue;

    if (truncatedValue.length === 6) {
      if (this.type === 'phone') {
        this.validatePhoneCode(truncatedValue);
      } else {
        this.validateEmailCode(truncatedValue);
      }
    }
  }

  validatePhoneCode(code: string) {
    this._accountServiceProxy.validateVerificationCodePhone(code)
      .subscribe({
        next: () => {
          this.dialog.dismiss();
          setTimeout(() => {
            this.session.user.isPhoneNumberConfirmed = true;
          }, 700);
        },
        error: (err) => {
          this.message.exception(err);
        }
      });
  }

  validateEmailCode(code: string) {
    this._accountServiceProxy.validateVerificationCodeEmail(code)
      .subscribe({
        next: () => {
          this.dialog.dismiss();
          setTimeout(() => {
            this.session.user.isEmailConfirmed = true;
          }, 700);
        },
        error: (err) => {
          this.message.exception(err);
        }
      });
  }

  resendCode() {
    if (this.countdownExpired) {
      this.startCountdown();
      this.isResendDisabled = true;
    }
    this.type === 'email'
      ? this.resendEmailCode()
      : this.resendPhoneCode();
  }

  resendPhoneCode() {
    this._accountServiceProxy.reSendVerificationCodePhone()
      .subscribe({
        next: () => {
        },
        error: (err: ApiException) => {
          this.message.exception(err);
        }
      });
  }

  resendEmailCode() {
    this._accountServiceProxy.reSendVerificationCodeEmail()
      .subscribe({
        next: () => {
        },
        error: (err: ApiException) => {
          this.message.exception(err);
        }
      });
  }
}
