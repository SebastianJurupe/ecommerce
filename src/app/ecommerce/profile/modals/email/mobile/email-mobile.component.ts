import { Component, Injector } from '@angular/core';
import { ApiException, ViewComponent } from '@geor360/core';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { EmailCodeComponent } from '../../email-code/email-code.component';

@Component({
  templateUrl: 'email-mobile.component.html',
  styleUrls: ['email-mobile.component.scss'],
  host: { 'app.email-mobile': 'true' }
})
export class EmailMobileComponent extends ViewComponent {

  private _profileServiceProxy: ProfileServiceProxy;

  email: string = '';
  isLoading: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
  }

  submit() {
    this.isLoading = true;
    this._profileServiceProxy.requireChangeEmail(this.email)
      .subscribe({
        next: () => {
          this.showModalEmailCode();
          this.isLoading = false;
        },
        error: (err: ApiException) => {
          this.isLoading = false;
          this.message.exception(err);
        }
      });
  }

  showModalEmailCode() {
    this.dialog.dismiss('close');

    setTimeout(() => {
      this.dialog.showWithData<"cancel" | undefined>({
        component: EmailCodeComponent,
        cssClass: ['modal-custom', 'modal-custom--full'],
        componentProps: {
          email: this.email
        }
      });
    }, 200);
  }

  disableButton() {
    return this.email === '' ||
      !this.email.includes('@') ||
      this.isLoading;
  }
}