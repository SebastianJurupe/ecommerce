import { Component, Injector, Input, OnInit } from '@angular/core';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { PaymentMethodGetAvailablesOutputAccountsDto, PaymentMethodServiceProxy } from '@shared/proxies/public/payment-method.proxie';
import { SuccessPaymentDesktopComponent } from '../../success-payment';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  templateUrl: 'payment-methods.component.html',
  styleUrls: ['payment-methods.component.scss'],
  host: { 'payment-methods': 'true' }
})
export class PaymentMethodsComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _paymentMethodServiceProxy: PaymentMethodServiceProxy;
  private _appConfigurtionService: AppConfigurationService;
  private _toolbar: AppTabService;

  @Input() amount: string = '';
  @Input() justInformative: boolean = false;

  loading: boolean = false;
  accounts: PaymentMethodGetAvailablesOutputAccountsDto[] = [];
  disabledButton: boolean = false
  constructor(_injector: Injector) {
    super(_injector);
    this._toolbar = _injector.get(AppTabService);
    this._appConfigurtionService = _injector.get(AppConfigurationService);
    this._paymentMethodServiceProxy = _injector.get(PaymentMethodServiceProxy);
  }

  get isMobile(): boolean {
    return this._appConfigurtionService.screen() === 'mobile';
  }

  get title(): string {
    return this.justInformative
      ? this.localization.localize('basket.typeMethods.instructions', 'ecommerce')
      : this.localization.localize('basket.typeMethods.title', 'ecommerce');
  }

  ngOnInit() {
    this.getPaymentMethods();
  }

  ionViewWillEnter() {
    if (this.isMobile) {
      this._toolbar.hide();
    } else {
      this._toolbar.show();
    }
  }

  getPaymentMethods() {
    this._paymentMethodServiceProxy.getAvailables()
      .subscribe({
        next: (response) => {
          this.loading = true;
          this.accounts = response.data[0].accounts;
        },
        error: (error: ApiException) => this.message.exception(error)
      });
  }

  goInbox() {
    this.dialog.dismiss('cancel');
    // this.navigation.forward("/app/ecommerce/inbox");
  }

  copy(term: number) {
    try {
      if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(term.toString());
      }
      this.notify.success('Copiado correctamente', 2500);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  confirm() {
    if (this.justInformative) {
      this.dialog.dismiss('cancel');
      return;
    };
    this.disabledButton = true
    this.dialog.dismiss('confirm');
  }

  succesPaymentModal() {
    this.dialog.showWithData({
      component: SuccessPaymentDesktopComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    });
  }

  close() {
    this.dialog.dismiss('cancel');
  }
}