import { Component, Injector, Input } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { NavController } from '@ionic/angular';
import { PaymentMethodsService } from '../../services/payment-methods.service';

@Component({
  templateUrl: 'payment-methods-base.component.html',
  styleUrls: ['payment-methods-base.component.scss'],
  host: { 'app.payment-methods-base': 'true' }
})
export class PaymentMethodsBaseComponent extends ViewComponent {

  private _configuration: AppConfigurationService;

  @Input() selectedPaymentMethod: string | null = null;

  device: string;

  constructor(_injector: Injector, private paymentMethodsService: PaymentMethodsService, private navCtrl: NavController) {
    super(_injector);
    this.selectedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  click(paymentMethod: string) {
    this.paymentMethodsService.setSelectedPaymentMethod(paymentMethod);
    this.selectedPaymentMethod = paymentMethod;
    localStorage.setItem('selectedPaymentMethod', this.selectedPaymentMethod);
    if (this.device === 'desktop') {
      this.dialog.dismiss();
    } else {
      this.navCtrl.back();
    }
  }

  buttonClose() {
    this.dialog.dismiss();
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }
}


