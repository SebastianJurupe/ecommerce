import { Component, Injector } from '@angular/core';
import { ApiException, AppConfigurationService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { OrderGetAllOutputDataDto, OrderServiceProxy } from '@shared/proxies/profile/order.proxie';
import { Subscription } from 'rxjs/internal/Subscription';

interface Resource {
  badge: string;
  name: string;
  format: string;
  method: () => void;
}

@Component({
  templateUrl: 'orders-base.component.html',
  styleUrls: ['orders-base.component.scss'],
  host: { 'app.orders-base': 'true' }
})
export class OrdersBaseComponent extends ViewComponent implements ViewWillEnter, ViewWillLeave {

  private _appConfigurationService: AppConfigurationService;
  private _orderServiceProxy: OrderServiceProxy;

  isLoading: boolean = false;
  lastPage: number = 0;
  orders: OrderGetAllOutputDataDto[] = [];
  ordersSubscription!: Subscription;
  page: number = 1;
  platform: string = '';
  popoverController: PopoverController;
  resources: Resource[] = [];
  status: string = 'ALL';

  constructor(_injector: Injector) {
    super(_injector);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._orderServiceProxy = _injector.get(OrderServiceProxy);
    this.popoverController = _injector.get(PopoverController);
  }

  ionViewWillEnter() {
    this.getOrders();
  }

  getOrders(status?: string) {
    this.isLoading = true;
    this.orders = [];
    this.ordersSubscription = this._orderServiceProxy.getAll(status)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          const { meta: { last_page } } = response;

          this.lastPage = last_page;

          this.orders = response.data;
        },
        error: (error: ApiException) => {
          this.isLoading = false;
          this.message.exception(error);
        }
      });
  }

  getMoreOrders(page?: number) {
    this.isLoading = true;
    this._orderServiceProxy.getAll(undefined, page)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          const { meta: { last_page } } = response;
          this.lastPage = last_page;

          this.orders = [...this.orders, ...response.data];
        },
        error: (error: ApiException) => {
          this.isLoading = false;
          this.message.exception(error);
        }
      });
  }

  navigateToOrderDetail(code: string) {
    this._appConfigurationService.screen() === 'desktop'
      ? this.navigation.forwardNoAnimation(`/app/ecommerce/profile/order-detail/${code}`)
      : this.navigation.forward(`/app/ecommerce/profile/order-detail/${code}`);
  }

  ionViewWillLeave(): void {
    this.ordersSubscription.unsubscribe();
  }
}