import { Component } from '@angular/core';
import { DeliveryType } from '../service/delivery-type.service';
import { StorePickupBaseComponent } from '../base/store-pickup-base.component';
import { DeliveryDetailsPopoverComponent } from '../delivery-details-popover/delivery-details-popover.component';

export interface Order {
  title: string;
  type: DeliveryType;
}

@Component({
  templateUrl: 'store-pickup-mobile.component.html',
  styleUrls: ['store-pickup-mobile.component.scss'],
  host: { 'app.store-pickup-mobile': 'true' }
})
export class StorePickupMobileComponent extends StorePickupBaseComponent {

  override async deliveryDetailsPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: DeliveryDetailsPopoverComponent,
      event: event,
      alignment: 'end',
      mode: 'ios',
      size: 'cover',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        deliveryTypeId: this.deliveryType.id
      },
      cssClass: ['delivery-details-popover']
    });

    await popover.present();
    const res = await popover.onDidDismiss();
    if (res.data) {
      if (this.deliveryType.id !== res.data.id) {
        this.agencies = undefined;
        this.store = undefined;
        this.summaryDetails[0].data = "0.00";
      }
      this.deliveryType = res.data;
      if (this.deliveryType.id === '01') {
        this.selectAddressOption = this.defaultAddressOption;
        this.summaryDetails[0].data = `${(+this.deliveryCost).toFixed(2)}`;
      }

    }

  }

  ionViewWillEnter() {
    this.toolbar.hide();
    this.getCartItems();

    this.firsTimeInvoiceMobile = this.billingService.firstTime;
  }

  override payMethods() {
    this.navigation.forward('app/ecommerce/basket/payment-methods');
  }
}
