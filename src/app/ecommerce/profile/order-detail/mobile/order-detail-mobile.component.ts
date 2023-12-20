import { Component, Injector } from '@angular/core';
import { OrderDetailBaseComponent } from '../base/order-detail-base.component';
import { ViewWillEnter } from '@ionic/angular';
import { BillingInfoPopoverComponent } from '../billing-info-popover/billing-info-popover.component';

@Component({
  templateUrl: 'order-detail-mobile.component.html',
  styleUrls: [
    'order-detail-mobile.component.scss',
    '../base/order-detail-base.component.scss'
  ],
  host: { 'app.order-detail-mobile': 'true' }
})
export class OrderDetailMobileComponent extends OrderDetailBaseComponent implements ViewWillEnter {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ionViewWillEnter() {
    this.toolbar.hide();
  }

  async openBillingInfoPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: BillingInfoPopoverComponent,
      event: event,
      arrow: false,
      side: 'top',
      cssClass: ['billing-info-popover']
    });

    await popover.present();
  }

  onBackButtonPressed() {
    this.overrided
      ? this.navigation.back('/app/ecommerce/profile/orders', { refresh: true })
      : this.navigation.back('/app/ecommerce/profile/orders');

  }
}
