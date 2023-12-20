import { Component } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { StorePickupBaseComponent } from '../base/store-pickup-base.component';

@Component({
  templateUrl: 'store-pickup-desktop.component.html',
  styleUrls: ['store-pickup-desktop.component.scss'],
  host: { 'app.store-pickup-desktop': 'true' }
})
export class StorePickupDesktopComponent extends StorePickupBaseComponent implements ViewWillEnter {

  ionViewWillEnter() {
    this.toolbar.show();
    this.getCartItems();
    this.setDefaultAddress();
    this.setDefaultInvoice();
    this.setSelectedAddress();
    this.coupon = ''
  }

  override ngOnInit() {
    this._deliveryTypeStateService.setDelivery('home');
    this._deliveryTypeStateService.getDelivery()
      .subscribe((res) => {
        this.delivery = res;
      });
    this._paymentMethodsService.selectedPaymentMethod$
      .subscribe((paymentMethod) => {
        this.selectedPaymentMethod = paymentMethod || '';
      });

    this.billingService.selectedStorePickupInvoice$
      .subscribe((selectedStorePickupInvoice) => {
        const { id, business_name, tax_identifier } = selectedStorePickupInvoice;
        this.selectedInvoice.id = id;
        this.selectedInvoice.business_name = business_name;
        this.selectedInvoice.tax_identifier = tax_identifier;
      });
    const { data } = this._activatedRoute.snapshot.queryParams;
    this.data = JSON.stringify(data);
  }
}
