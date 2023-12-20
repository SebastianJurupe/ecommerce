import { Component, Injector } from '@angular/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { OrderDetailBaseComponent } from '../base/order-detail-base.component';
import { BillingInfoPopoverComponent } from '../billing-info-popover/billing-info-popover.component';

@Component({
  templateUrl: 'order-detail-desktop.component.html',
  styleUrls: [
    'order-detail-desktop.component.scss',
    '../base/order-detail-base.component.scss'
  ],
  host: { 'app.order-detail-desktop': 'true' }
})
export class OrderDetailDesktopComponent extends OrderDetailBaseComponent {

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  async openBillingInfoPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: BillingInfoPopoverComponent,
      event: event,
      arrow: false,
      side: 'top',
      alignment: 'end',
      cssClass: ['billing-info-popover-desktop']
    });

    await popover.present();
  }
}
