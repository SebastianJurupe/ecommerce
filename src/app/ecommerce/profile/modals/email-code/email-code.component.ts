import { AfterViewInit, Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { IonInput } from '@ionic/angular';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { PersonalInformationService } from '../../services/personal-information.service';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: 'email-code.component.html',
  styleUrls: ['email-code.component.scss'],
  host: { 'app.email-code': 'true' }
})
export class EmailCodeComponent extends ViewComponent implements OnInit, AfterViewInit {

  private _personalInformationService: PersonalInformationService;
  private _profileServiceProxy: ProfileServiceProxy;
  private _authService: AuthService;

  @ViewChild('ionInput', { static: true }) ionInput!: IonInput;

  @Input() email: string = '';

  inputModel = '';
  isMaxLengthReached = false;
  countdown: string = '0:32';
  isResendDisabled = true;
  countdownExpired = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._authService = _injector.get(AuthService);
    this._personalInformationService = _injector.get(PersonalInformationService);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
  }

  ngOnInit() {
    this.startCountdown();
  }

  ngAfterViewInit() {
    setTimeout(() => { this.ionInput.setFocus(); }, 700);
  }

  startCountdown() {
    let seconds = 32;
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
      this.validateCode(this.email, truncatedValue);
    }
  }

  validateCode(email: string, code: string) {
    this._profileServiceProxy.validateCodeEmailChange(email, code)
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
  }

}

