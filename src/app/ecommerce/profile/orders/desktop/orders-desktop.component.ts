import { Component, Injector } from '@angular/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { OrdersBaseComponent } from '../base/orders-base.component';
import { OrderStatusPopoverComponent } from '../order-status-popover/order-status-popover.component';

@Component({
  templateUrl: 'orders-desktop.component.html',
  styleUrls: ['orders-desktop.component.scss'],
  host: { 'app.orders-desktop': 'true' }
})
export class OrdersDesktopComponent extends OrdersBaseComponent {

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  async openFilterPopover(event: any) {
    const popover = await this.popoverController.create({
      component: OrderStatusPopoverComponent,
      arrow: false,
      event: event,
      componentProps: {
        status: this.status
      },
      cssClass: ['order-status-popover-desktop'],
      side: 'bottom',
      alignment: 'end',
    });


    await popover.present();

    const res = await popover.onDidDismiss();

    if (res.data) {
      if (this.status === res.data) return;
      this.getOrders(res.data);
      this.status = res.data;
    }
  }

  loadMoreOrders() {
    if (this.page < this.lastPage) {
      this.page++;
      this.getMoreOrders(this.page);
    }
  }

  brandButtonEventCliked() {
    this.navigation.back('/app/ecommerce/home/home');
  }

  inboxClick() {
    // this.navigation.back('/app/ecommerce/inbox');
  }
}
