import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ApiException, ViewComponent } from '@geor360/core';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { CodeConfirmationService } from '../../services/code-confirmation.service';
import { IonInput } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-code-confirmation-reset-base',
  templateUrl: 'code-confirmation-reset-base.component.html',
  styleUrls: ['code-confirmation-reset-base.component.scss'],
  host: { 'app.code-confirmation-reset-base': 'true' }
})
export class CodeConfirmationResetBaseComponent extends ViewComponent implements OnInit {

  private _activatedRoute: ActivatedRoute;
  private _codeConfirmationService: CodeConfirmationService;

  @ViewChild('ionInput') ionInput!: IonInput;

  @Input() emailTablet: string = '';
  @Input() tablet: boolean = false;

  accountServiceProxy: AccountServiceProxy;
  countdown: string = '0:30';
  countdownExpired = false;
  countdownInterval: any;
  email: string = '';
  inputModel = '';
  isMaxLengthReached = false;
  isResendDisabled = true;

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._codeConfirmationService = _injector.get(CodeConfirmationService);
    this.accountServiceProxy = _injector.get(AccountServiceProxy);
  }

  ionViewDidLeave() {
    this.inputModel = '';
  }

  ngOnInit() {
    const { email } = this._activatedRoute.snapshot.params;
    this.email = email;

    if (this.tablet) {
      this.email = this.emailTablet;
    }
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

  validateResetPasswordCode(code: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {

      this._codeConfirmationService.setResetPasswordData({
        email: this.email,
        code: code,
      });
      resolve(true);

    });
  }

  onResendCode() {
    if (this.countdownExpired) {
      setTimeout(() => this.ionInput.setFocus(), 700);
      this.onStartCountdown();
      this.isResendDisabled = true;
      this.accountServiceProxy.resetPasswordResendCode(this.email)
        .subscribe({
          next: (_response) => { },
          error: (err: ApiException) => {
            this.message.exception(err);
          }
        });
    }
  }
}
