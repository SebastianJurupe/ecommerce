import { Component } from '@angular/core';
import { AddBillingBaseComponent } from '../base/add-billing-base.component';

@Component({
  templateUrl: 'add-billing-mobile.component.html',
  styleUrls: ['add-billing-mobile.component.scss'],
  host: { 'app.add-billing-mobile': 'true' }
})
export class AddBillingMobileComponent extends AddBillingBaseComponent {

  ionViewWillEnter() {
    this._toolbar.hide();
  }

  save() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
    this.billingService.firstTime = false
    this.billingService.setStorePickupInvoice(this.selectedBilling);
  }

  goToCreateBilling() {
    this.navigation.forward("/app/ecommerce/profile/invoicing-form", { path: 'add-billing' });
  }

  goToEditBilling(id: number) {
    this.navigation.forward(`/app/ecommerce/profile/invoicing-form?path=edit-billing-basket&id=${id}`);
  }

  onBackButtonPressed() {
    this.navigation.back("/app/ecommerce/basket/store-pickup");
  }
}
