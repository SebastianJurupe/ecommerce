import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PhoneCodeComponent } from '../../phone-code/phone-code.component';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';

@Component({
  templateUrl: 'phone-tablet.component.html',
  styleUrls: ['phone-tablet.component.scss'],
  host: { 'app.phone-tablet': 'true' }
})
export class PhoneTabletComponent extends ViewComponent {

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
            this.showModalPhoneCode();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.message.exception(err)
        }
      });
  }

  // openCodeConfirmationModal() {
  //   this.dialog.dismiss('close');
  //   setTimeout(() => {
  //     this.dialog.showWithData<"cancel" | undefined>({
  //       component: PhoneCodeComponent,
  //       cssClass: ['modal-custom', 'modal-custom--full'],
  //       componentProps: {
  //         phone: this.phone
  //       }
  //     });
  //   }, 200);
  // }

  showModalPhoneCode() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: PhoneCodeComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      componentProps: {
        phone: this.phone
      }
    });
  }

  dismiss() {
    if (!this.isLoading) {
      this.dialog.dismiss('cancel');
    }
  }
}

