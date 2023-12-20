import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { IonInput, Platform, ViewWillEnter } from '@ionic/angular';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';


@Component({
  templateUrl: 'code-confirmation-email-base.component.html',
  styleUrls: ['code-confirmation-email-base.component.scss'],
  host: { 'app.code-confirmation-email-base': 'true' }
})
export class CodeConfirmationEmailBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _accountServiceProxy: AccountServiceProxy;
  private _activatedRoute: ActivatedRoute;

  @ViewChild('ionInput') ionInput!: IonInput;

  countdown: string = '0:30';
  countdownExpired = false;
  countdownInterval!: NodeJS.Timeout;
  email: string = '';
  inputModel = '';
  isMaxLengthReached = false;
  isResendDisabled = true;
  platform: Platform;
  toolbar: AppTabService;

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this.platform = _injector.get(Platform);
    this.toolbar = _injector.get(AppTabService);
  }

  ionViewWillEnter() {
    const { email } = this._activatedRoute.snapshot.params;
    this.email = email;

    this.toolbar.hide();
    setTimeout(() => this.ionInput.setFocus(), 700);
  }

  ionViewDidLeave() {
    this.inputModel = '';
  }

  ngOnInit() {
    this.onStartCountdown();
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
      this._accountServiceProxy.reSendVerificationCodeEmail()
        .subscribe({
          next: (_response) => { },
          error: (err: ApiException) => {
            this.message.exception(err);
          }
        });
    }
  }

  onValidateCode(code: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this._accountServiceProxy.validateVerificationCodeEmail(code)
        .subscribe({
          next: (response) => {
            if (response.success) {
              resolve(true);
            }
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
