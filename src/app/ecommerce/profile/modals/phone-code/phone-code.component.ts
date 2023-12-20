import { AfterViewInit, Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ApiException, ViewComponent } from '@geor360/core';
import { IonInput } from '@ionic/angular';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { PersonalInformationService } from '../../services/personal-information.service';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: 'phone-code.component.html',
  styleUrls: ['phone-code.component.scss'],
  host: { 'app.phone-code': 'true' }
})
export class PhoneCodeComponent extends ViewComponent implements OnInit, AfterViewInit {

  private _authService: AuthService;
  private _personalInformationService: PersonalInformationService;
  private _profileServiceProxy: ProfileServiceProxy;

  @ViewChild('ionInput', { static: true }) ionInput!: IonInput;

  @Input() phone: string = '';

  inputModel = '';
  isMaxLengthReached = false;
  countdown: string = '0:30';
  isResendDisabled = true;
  countdownExpired = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._authService = _injector.get(AuthService);
    this._personalInformationService = _injector.get(PersonalInformationService);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
  }

  ngAfterViewInit() {
    setTimeout(() => { this.ionInput.setFocus(); }, 500);
  }

  ngOnInit() {
    this.startCountdown();
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
      this.validateCode(truncatedValue, this.phone);
    }
  }

  validateCode(code: string, phone: string) {
    this._profileServiceProxy.validateCodeUpdatePhone(phone, code)
      .subscribe({
        next: async () => {
          try {
            const updated = await this._personalInformationService.setPersonalInformation();

            if (updated) {
              this._authService.loadSession(async () => {
                this.dialog.dismiss();
                const message = this.localization.localize('profile.home.updatePersonalInformation', 'ecommerce');
                await this.notify.success(message, 2500);
              });
            }
          } catch (error) {
            console.error(error);
          }
        },
        error: (err: ApiException) => {
          this.message.exception(err);
        }
      });
  }

  resendCode() {
    this.isResendDisabled = true;
    if (this.countdownExpired) {
      this._profileServiceProxy.updatePhone(this.phone)
        .subscribe({
          next: () => {
            this.isResendDisabled = false;
            this.startCountdown();
          },
          error: (err: ApiException) => {
            this.isResendDisabled = false;
            this.message.exception(err);
          }
        });
    }
  }

}
