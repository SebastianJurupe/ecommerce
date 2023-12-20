import { Component, Injector } from '@angular/core';
import { ApiException, ViewComponent } from '@geor360/core';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { PhoneCodeComponent } from '../../phone-code/phone-code.component';

@Component({
  templateUrl: 'phone-mobile.component.html',
  styleUrls: ['phone-mobile.component.scss'],
  host: { 'app.phone-mobile': 'true' }
})
export class PhoneMobileComponent extends ViewComponent {

  private _profileServiceProxy: ProfileServiceProxy;

  phone: string = '';
  isLoading: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
  }

  submit() {
    this.isLoading = true;
    this._profileServiceProxy.updatePhone(this.phone)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.openCodeConfirmationModal();
          }
        },
        error: (error: ApiException) => {
          this.isLoading = false;
          this.message.exception(error);
        }
      });
  }

  openCodeConfirmationModal() {
    this.dialog.dismiss('close');

    setTimeout(() => {
      this.dialog.showWithData<"cancel" | undefined>({
        component: PhoneCodeComponent,
        cssClass: ['modal-custom', 'modal-custom--full'],
        componentProps: {
          phone: this.phone,
        }
      });
    }, 200);
  }

  dismiss() {
    if (!this.isLoading) {
      this.dialog.dismiss('cancel');
    }
  }
}