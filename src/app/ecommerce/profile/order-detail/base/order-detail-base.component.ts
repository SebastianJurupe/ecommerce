import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';
import { OrderGetOutputDataDto, OrderServiceProxy } from '@shared/proxies/profile/order.proxie';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { PaymentMethodsComponent } from 'src/app/ecommerce/basket/modals/payment-methods/payment-methods.component';
import { DeleteOrderComponent } from '../../modals/delete-order/delete-order.component';
import { OptionsOrderPopoverComponent } from '../options-order-popover/options-order-popover.component';

interface Summary {
  description: string;
  value: number;
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDIENTE DE PAGO',
  IN_PREPARATION = 'EN PREPARACIÓN',
  IN_WAY = 'EN CAMINO',
  DELIVERED = 'ENTREGADO',
  CANCELLED = 'ANULADO'
}

interface OrderStatusLabels {
  label: string;
  sublabel: string;
};

@Component({
  templateUrl: 'order-detail-base.component.html',
  styleUrls: ['order-detail-base.component.scss'],
  host: { 'app.order-detail-base': 'true' }
})
export class OrderDetailBaseComponent extends ViewComponent implements OnInit {

  private _activatedRoute: ActivatedRoute;
  private _animationModalService: AnimationModalService;
  private _orderServiceProxy: OrderServiceProxy;

  appConfigurationService: AppConfigurationService;
  isLoading: boolean = false;
  isProductsListExpanded: boolean = true;
  months: string[] = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  order: OrderGetOutputDataDto = new OrderGetOutputDataDto();
  overrided: boolean = false;
  popoverController: PopoverController;
  summaryDetails: Summary[] = [];
  toolbar: AppTabService;

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._animationModalService = _injector.get(AnimationModalService);
    this._orderServiceProxy = _injector.get(OrderServiceProxy);
    this.appConfigurationService = _injector.get(AppConfigurationService);
    this.popoverController = _injector.get(PopoverController);
    this.toolbar = _injector.get(AppTabService);
  }

  get instructionModalClasses(): string[] {
    return this.appConfigurationService.screen() === 'mobile'
      ? ['modal-custom', 'modal-custom--full']
      : ['modal-custom', 'modal-custom--in-center-medium'];
  }

  get optionsPopoverClasses(): string[] {
    return this.appConfigurationService.screen() === 'mobile'
      ? ['order-details-popover']
      : ['order-details-popover', 'desktop'];
  }

  get productsQuantity(): string {
    return `${this.localization.localize("profile.orderDetail.priceProducts", "ecommerce")} (${this.order.items.length})`;
  }

  get statusBar() {
    switch (this.order.status as OrderStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return ['red', 'bar', 'bar', 'bar'];

      case OrderStatus.IN_PREPARATION:
        return ['orange', 'orange', 'bar', 'bar'];

      case OrderStatus.IN_WAY:
        return ['blue', 'blue', 'blue', 'bar'];

      case OrderStatus.DELIVERED:
        return ['green', 'green', 'green', 'green'];

      default:
        return ['red', 'bar', 'bar', 'bar'];
    }
  }

  get statusBackground(): string {
    switch (this.order.status as OrderStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return 'status-container-error';

      case OrderStatus.IN_PREPARATION:
        return 'status-container-warning';

      case OrderStatus.IN_WAY:
        return 'status-container-info';

      case OrderStatus.DELIVERED:
        return 'status-container-success';

      case OrderStatus.CANCELLED:
        return 'status-container-canceled';

      default:
        return 'status-container-loading';
    }
  }

  get orderStatusLabels(): OrderStatusLabels {
    switch (this.order.status as OrderStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return {
          label: this.localization.localize("profile.home.label.pendingPayment", "ecommerce"),
          sublabel: this.localization.localize("profile.home.sublabel.pendingPayment", "ecommerce"),
        };

      case OrderStatus.IN_PREPARATION:
        return {
          label: this.localization.localize("profile.orderDetail.preparation", "ecommerce"),
          sublabel: this.localization.localize("profile.orderDetail.preparation.information", "ecommerce"),
        };

      case OrderStatus.IN_WAY:
        return {
          label: this.localization.localize("profile.orderDetail.way", "ecommerce"),
          sublabel: this.localization.localize("profile.orderDetail.way.information", "ecommerce"),
        };

      case OrderStatus.DELIVERED:
        return {
          label: this.localization.localize("profile.orderDetail.delivered", "ecommerce"),
          sublabel: this.localization.localize("profile.orderDetail.delivered.information", "ecommerce")
        };

      case OrderStatus.CANCELLED:
        return {
          label: this.localization.localize("profile.orderDetail.canceled", "ecommerce"),
          sublabel: this.localization.localize("profile.orderDetail.canceled.information", "ecommerce"),
        };

      default:
        return {
          label: '',
          sublabel: ''
        };
    }
  }

  get contentMarginTop(): string {
    return this.order.status === 'ANULADO'
      ? '88px'
      : '118px';
  }

  get enterAnimation() {
    return this.appConfigurationService.screen() === 'mobile'
      ? undefined
      : this._animationModalService.openDesktopModal;
  }

  get leaveAnimation() {
    return this.appConfigurationService.screen() === 'mobile'
      ? undefined
      : this._animationModalService.closeDesktopModal;
  }

  ngOnInit() {
    const { code } = this._activatedRoute.snapshot.params;
    this.getOrderDetail(code);
  }

  getOrderDetail(code: string) {
    this.isLoading = true;
    this._orderServiceProxy.get(code)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          const { subtotal, total, total_shipments, total_taxes, discounts } = response.data;

          this.order = response.data;
          this.setSummaryDetails(subtotal, total, total_shipments, total_taxes, discounts);
        },
        error: (error: ApiException) => {
          this.isLoading = false;
          this.message.exception(error);
        }
      });
  }

  showInstructions() {
    this.dialog.showWithData({
      component: PaymentMethodsComponent,
      componentProps: {
        amount: `${this.order.total.toFixed(2)}`,
        justInformative: true,
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: this.instructionModalClasses
    });
  }

  setSummaryDetails(subtotal: number, total: number, total_shipments: number, total_taxes: number, discounts: number) {
    this.summaryDetails = [
      { description: this.localization.localize("profile.orderDetail.priceProducts", "ecommerce"), value: subtotal },
      { description: this.localization.localize("profile.orderDetail.costShopping", "ecommerce"), value: total_shipments },
      { description: this.localization.localize("profile.orderDetail.coupon", "ecommerce"), value: discounts },
      { description: this.localization.localize("profile.orderDetail.taxes", "ecommerce"), value: total_taxes },
      { description: 'Total', value: total }
    ];
  }

  toggleProductsListExpansion() {
    this.isProductsListExpanded = !this.isProductsListExpanded;
  }

  async optionsPopover(event: Event) {
    if (this.order.status === 'ANULADO') return;
    const popover = await this.popoverController.create({
      component: OptionsOrderPopoverComponent,
      event: event,
      alignment: 'end',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {},
      cssClass: this.optionsPopoverClasses
    });

    await popover.present();

    const res = await popover.onDidDismiss();
    if (res.data !== 'override') return;
    this.appConfigurationService.screen() === 'desktop'
      ? this.cancelOrder(this.order.code)
      : this.cancelOrderModal();

  }

  cancelOrder(code: string) {
    this._orderServiceProxy.cancel(code)
      .subscribe({
        next: () => {
          this.overrided = true;
          this.order.status = 'ANULADO';
          this.notify.success('Pedido anulado correctamente', 2500);
        },
        error: (error: ApiException) => {
          this.message.exception(error);
        }
      });
  }

  cancelOrderModal() {
    this.dialog.showWithData({
      component: DeleteOrderComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    }).then(async (res) => {
      if (res.data.result !== 'cancel') {
        this.cancelOrder(this.order.code);
      }
    });
  }

  openNewTab() {
    const url = this.order.document.pdf_preview;
    console.log(url);

    window.open(url, '_blank');

    // const url = this.order.document.pdf;
    // console.log(url);
    // // const button = document.querySelector('#openpdf');

    // const response = await fetch(url);
    // const data = await response.blob();
    // const urlBlob = window.URL.createObjectURL(data);
    // const open = document.createElement('a');
    // open.href = urlBlob;
    // open.target = '_blank';
    // open.click();

    // window.open(url, '_blank');

  }
}
