import { Component, Injector, } from '@angular/core';
import { HomeBaseComponent } from '../base/home-base.component';
import { DeleteProductComponent } from '../../modals/delete-product/delete-product.component';
import { PopoverDeleteProductComponent } from '@geor360/ecommerce-components';
import { PopoverController } from '@ionic/angular';

@Component({
  templateUrl: 'home-mobile.component.html',
  styleUrls: ['home-mobile.component.scss'],
  host: { 'app.basket.home-mobile': 'true' }
})
export class HomeMobileComponent extends HomeBaseComponent {

  private _popoverController: PopoverController;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
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
      alignment: "start",
      cssClass: ['background-popover', 'offset--minus-24',  'delete'],
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

}
