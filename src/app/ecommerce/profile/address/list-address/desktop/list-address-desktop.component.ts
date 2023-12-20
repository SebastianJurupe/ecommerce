import { Component, Injector } from '@angular/core';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { DeleteAddressComponent } from '../../../modals/delete-address/delete-address.component';
import { FormAddressDesktopComponent } from '../../form-address';
import { ListAddressBaseComponent } from '../base/list-address-base.component';

@Component({
  templateUrl: 'list-address-desktop.component.html',
  styleUrls: ['list-address-desktop.component.scss'],
  host: { 'app.list-address-desktop': 'true' }
})
export class ListAddressDesktopComponent extends ListAddressBaseComponent {

  private _animationModalService: AnimationModalService;

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  onDelete(id: number) {
    this.dialog.showWithData({
      component: DeleteAddressComponent,
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-desktop'],
      componentProps: {
        desktop: true
      }
    }).then(async (res) => {
      if (res.data.result !== 'cancel') {

        const deleted = await this.addressService.deleteById(id);

        if (deleted) {
          const message: string = this.localization.localize('profile.address.deleteAddress.succesfullyDeleted', 'ecommerce');
          this.notify.success(message, 2500);
        }
      }
    });
  }

  onEdit(id: number) {
    this.dialog.showWithData({
      component: FormAddressDesktopComponent,
      componentProps: {
        id: id
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium']
    });
  }

  onNewAddress() {
    this.dialog.showWithData({
      component: FormAddressDesktopComponent,
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium']
    });
  }
}
