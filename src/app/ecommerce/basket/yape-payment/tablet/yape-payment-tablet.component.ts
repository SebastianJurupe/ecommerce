import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { CodeYapeComponent } from '../../modals/code-yape/code-yape.component';
interface Card {
  id: string;
  type: string;
  description: string;
}
@Component({
  templateUrl: 'yape-payment-tablet.component.html',
  styleUrls: ['yape-payment-tablet.component.scss'],
  host: { 'app.yape-payment-tablet': 'true' }
})
export class YapePaymentTabletComponent extends ViewComponent implements OnInit {

  celular: string = ''; // Modelo de datos para el número de celular
  codigoAprobacion: string = '';

  cards: Card[] = [
    {
      id: '1',
      type: 'visa',
      description: 'Yape'
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }

  openCodeModal() {
    this.dialog.showWithData({
      component: CodeYapeComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    });
  }

  voucherPay() {
    this.navigation.forward('/app/ecommerce/basket/voucher');
  }

  back() {
    this.navigation.back('/app/ecommerce/basket/store-pickup');
  }

}

