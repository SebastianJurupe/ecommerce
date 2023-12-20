import { Component, Injector } from '@angular/core';
import { HomeBaseComponent } from '../base/home-base.component';
import { DeleteProductComponent } from '../../modals/delete-product/delete-product.component';
import { PopoverDeleteProductComponent } from '@geor360/ecommerce-components';
import { PopoverController } from '@ionic/angular';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';

@Component({
  templateUrl: 'home-desktop.component.html',
  styleUrls: ['home-desktop.component.scss'],
  host: { 'app.basket.home-desktop': 'true' }
})
export class HomeDesktopComponent extends HomeBaseComponent {

  private _popoverController: PopoverController;

  headerDesktopService: HeaderDesktopService;
  summaryDetails = [
    {
      id: 'delivery-cost',
      label: this.localization.localize('basket.storePickup.deliveryBoxTitle', 'ecommerce'),
      data: 'S/ 0.00'
    },
    {
      id: 'coupon',
      label: this.localization.localize('basket.storePickup.couponBoxTitle', 'ecommerce'),
      data: 'S/ 0.00'
    },
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  indexSelectedNow(index: number) {
    this.indexSelected = index;
  }

  async clickDeleteProduct() {
    await this.dialog.showWithData<'cancel' | any>({
      component: DeleteProductComponent,
      componentProps: {
        id: 2,
      },
      cssClass: ['modal-custom', 'modal-custom--in-center']
    }).then((response) => {
      if (response.data.result !== 'cancel') {
      }
    });
  }

  async presentPopover(idProduct: number, event: any) {
    const popover = await this._popoverController.create({
      component: PopoverDeleteProductComponent,
      size: "auto",
      side: "bottom",
      alignment: "end",
      cssClass: ['background-popover', 'delete'],
      arrow: false,
      mode: "ios",
      animated: false,
      showBackdrop: true,
      event: event,
      componentProps: {
        language: this.localization.currentLanguage,
      },
    });

    popover.onDidDismiss().then((modelData: any) => {
      if (modelData.data !== undefined && modelData.data !== null) {
        this.delete(idProduct);
      }
    });
    return await popover.present();
  }

  override async clickDeleteOneProduct(id: number) {
    await this.dialog.showWithData<'cancel' | any>({
      component: DeleteProductComponent,
      componentProps: {
        id: id,
        desktop: true
      },
      cssClass: ['modal-custom', 'modal-custom--in-center-desktop']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.deleteItem(id);
      }
    });
  }

  getVariantData(items: any, variantId: number) {
    let data = null;
    data = items.variants.filter((variant: any) => variant.id === variantId);
    return data[0];
  }

  getVariantDetails(items: any, variantId: number) {
    let data = null;
    let variantDetails = '';
    data = items.variants.filter((variant: any) => variant.id === variantId);
    let i = 0;
    for (let item of data[0].values) {
      variantDetails = variantDetails + item.value + (i < data[0].values.length - 1 ? ',' : '');
      i++;
    }
    return variantDetails;
  }

  clickOk() {
  }

  deliveryDesktop() {
    //this.navigation.forward('/app/ecommerce/basket/store-pickup', { path: 'basket-home' });
    // const data = this.cartData;
    this.navigation.forwardNoAnimation('app/ecommerce/basket/store-pickup', {
      path: 'basket-home',
      // data: data,
    });
  }


}