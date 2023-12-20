import { Component, Injector, Input } from '@angular/core';
import { ApiException, ViewComponent } from '@geor360/core';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { EmailCodeComponent } from '../../email-code/email-code.component';

@Component({
  templateUrl: 'email-base.component.html',
  styleUrls: ['email-base.component.scss'],
  host: { 'app.email-base': 'true' }
})
export class EmailBaseComponent extends ViewComponent {

  private _profileServiceProxy: ProfileServiceProxy;

  @Input() email: string = '';

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
          this.message.exception(err);
          this.isLoading = false;
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