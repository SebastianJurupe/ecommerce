import { Component, Injector, Input } from '@angular/core';
import { FreightForwardersBaseComponent } from '../base/freight-forwarders-base.component';
import { Address } from 'src/app/ecommerce/basket/store-pickup/address-calculate.service';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'freight-forwarders-desktop.component.html',
  styleUrls: ['freight-forwarders-desktop.component.scss'],
  host: { 'freight-forwarders-desktop': 'true' }
})
export class FreightForwardersDesktopComponent extends FreightForwardersBaseComponent {

  private _animationModalService: AnimationModalService;

  @Input() detail: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
  }

  confirmAgency(agency: any) {
    let agencyData = {
      agency: agency,
      address: this.address
    };
    this.dialog.dismiss(agencyData);
  }

  override ionViewWillEnter() {
    if (!this.detail) {
      this._toolbar.show();
    }
  }

  override chooseAddress() {
    this.dialog.showWithData({
      component: this.addressModal,
      componentProps: {
        usedAsModal: true,
        selectedAddress: this.address,
        productId: this.productId,
        detail: this.detail
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: this.modalClasses,
      showBackdrop: false,
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        const address = response.data.result as Address;
        if (address.country !== 'PE') return;
        this.address = address;
        this.shoppingCart
          ? this.calculateShoppingCartPrices(address.extra[2].ubigeo)
          : this.calculatePrices(address.extra[2].ubigeo);
      }
    });
  }
}
