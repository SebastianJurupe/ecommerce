import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController, ViewWillEnter } from '@ionic/angular';
import { BarProductsBaseComponent } from '../base/bar-products-base.component';

@Component({
  templateUrl: 'bar-products-mobile.component.html',
  styleUrls: [
    'bar-products-mobile.component.scss',
    '../base/bar-products-base.component.scss'
  ],
  host: { 'app.bar-products-mobile': 'true' }
})
export class BarProductsMobileComponent extends BarProductsBaseComponent implements OnInit, ViewWillEnter {

  private _navController: NavController;

  @ViewChild('content') content!: IonContent;

  constructor(_injector: Injector) {
    super(_injector);
    this._navController = _injector.get(NavController);
  }

  navigateToCart() {
    this.navigation.forward('/app/ecommerce/basket');
  }

  handleOffsetTop(offset: number, hasVariants: boolean) {
    if (offset !== 0 && !hasVariants) {
      this.content.scrollToPoint(0, offset - 300, 1000);
    }
  }

  back() {
    this._navController.back({ animated: true });
  }
}
