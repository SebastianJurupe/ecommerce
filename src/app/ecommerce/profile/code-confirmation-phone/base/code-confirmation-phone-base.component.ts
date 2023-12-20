import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { IonInput, ViewWillEnter } from '@ionic/angular';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';

@Component({
  selector: 'app-code-confirmation-phone-base',
  templateUrl: 'code-confirmation-phone-base.component.html',
  styleUrls: ['code-confirmation-phone-base.component.scss'],
  host: { 'app.code-confirmation-phone-base': 'true' }
})
export class CodeConfirmationPhoneBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _accountServiceProxy: AccountServiceProxy;

  @ViewChild('ionInput') ionInput!: IonInput;

  countdown: string = '0:30';
  countdownExpired = false;
  countdownInterval!: NodeJS.Timeout;
  email: string = '';
  inputModel = '';
  isMaxLengthReached = false;
  isResendDisabled = true;
  phone: string = '';
  toolbar: AppTabService;

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this.toolbar = _injector.get(AppTabService);
  }

  ionViewWillEnter() {
    this.toolbar.hide();
    setTimeout(() => this.ionInput.setFocus(), 700);
  }

  ngOnInit() {
    this.onStartCountdown();
    setTimeout(() => this.ionInput.setFocus(), 700);
  }

  onStartCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    let seconds = 30;
    this.onUpdateCountdown(seconds);

    this.countdownInterval = setInterval(() => {
      seconds--;

      if (seconds >= 0) {
        this.onUpdateCountdown(seconds);
      } else {
        clearInterval(this.countdownInterval);
        this.countdownExpired = true;
        this.isResendDisabled = false;
      }
    }, 1000);
  }

  onUpdateCountdown(seconds: number) {
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    this.countdown = `0:${formattedSeconds}`;
  }

  onResendCode() {
    if (this.countdownExpired) {
      setTimeout(() => this.ionInput.setFocus(), 700);
      this.onStartCountdown();
      this.isResendDisabled = true;
      this._accountServiceProxy.reSendVerificationCodePhone()
        .subscribe({
          next: (_response) => { },
          error: (err: ApiException) => {
            this.message.exception(err);
          }
        });
    }
  }

  onSendEmailCode() {
    this._accountServiceProxy.sendVerificationCodeEmail().subscribe({
      next: () => { },
      error: (err) => {
        throw new Error(err);
      }
    });
  }

  onValidatePhoneCode(code: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this._accountServiceProxy.validateVerificationCodePhone(code)
        .subscribe({
          next: (response) => {
            if (response.success) {
              resolve(true);
            };
          },
          error: (err) => {
            reject(false);
            this.message.exception(err);
            throw new Error(err);
          },
        });
    });
  }
}
