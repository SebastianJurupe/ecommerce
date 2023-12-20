import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppTabService } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { OrdersBaseComponent } from '../base/orders-base.component';
import { OrderStatusPopoverComponent } from '../order-status-popover/order-status-popover.component';


@Component({
  templateUrl: 'orders-mobile.component.html',
  styleUrls: ['orders-mobile.component.scss'],
  host: { 'app.orders-mobile': 'true' }
})
export class OrdersMobileComponent extends OrdersBaseComponent implements ViewWillEnter {

  private _activatedRoute: ActivatedRoute;
  private _toolbar: AppTabService;

  showInfiniteScroll: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._toolbar = _injector.get(AppTabService);
  }

  override ionViewWillEnter() {
    const { loadMore, refresh } = this._activatedRoute.snapshot.queryParams;
    this.getOrders();
    if (loadMore || refresh) this.getOrders();
    this._toolbar.hide();
  }

  async openFilterPopover(event: any) {
    const popover = await this.popoverController.create({
      component: OrderStatusPopoverComponent,
      arrow: false,
      event: event,
      componentProps: {
        status: this.status
      },
      cssClass: ['order-status-popover'],
    });

    await popover.present();

    const res = await popover.onDidDismiss();

    if (res.data) {
      if (this.status === res.data) return;
      this.getOrders(res.data);
      this.status = res.data;
    }
  }

  loadMoreOrders(event: any) {
    this.showInfiniteScroll = true;
    if (this.page < this.lastPage) {
      this.page++;
      this.getMoreOrders(this.page);
    }
    setTimeout(() => {
      event.target.complete();
    }, 700);
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/home');
    this._toolbar.show();
  }
}
