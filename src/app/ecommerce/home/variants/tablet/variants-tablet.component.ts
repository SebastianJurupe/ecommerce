import { Component, Injector, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { AddProductComponent } from '../../modals/add-product/add-product.component';
import { ImageProductCompleteMobileComponent } from '../../modals/image-product-complete';

@Component({
  templateUrl: 'variants-tablet.component.html',
  styleUrls: ['variants-tablet.component.scss'],
  host: { 'app.variants-tablet': 'true' }
})
export class VariantsTabletComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _toolbar: AppTabService;
  private _configuration: AppConfigurationService;

  buttonToggle = false;
  showSizes: boolean = true;
  showThickness: boolean = true;
  showTexture: boolean = true;
  device: string;
  onFocusButtonIncremental: boolean = false;
  showMenuInput: boolean = false;
  variantData: any = {
    description: '',
    prices: [],
    sizes: [],
    thickness: [],
    texture: [],
    colors: [],
  };

  constructor(_injector: Injector) {
    super(_injector);
    this._toolbar = _injector.get(AppTabService);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ngOnInit() { }

  ionViewWillEnter(): void {
    this._toolbar.hide();
  }

  openModal() {
    this.dialog.showWithData({
      component: AddProductComponent,
      cssClass: ['modal-custom', 'modal-custom--bottom']
    });
  }

  closeSizes() {
    this.showSizes = !this.showSizes;
  }

  closeThickness() {
    this.showThickness = !this.showThickness;
  }

  closeTexture() {
    this.showTexture = !this.showTexture;
  }

  toggleButton() {
    this.buttonToggle = !this.buttonToggle;
  }

  async share() {
    await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: 'https://geor.app/',
      dialogTitle: '',
    });
  }

  openImg() {
    this.buttonToggle = false;
    this.dialog.showWithData({
      component: ImageProductCompleteMobileComponent,
      cssClass: ['modal-custom', 'modal-custom--full']
    });
  }

  focus() {
    this.showMenuInput = true;
    this.onFocusButtonIncremental = true;
  }

  blur() {
    this.onFocusButtonIncremental = false;
    this.showMenuInput = false;
    setTimeout(
      () => {
        if (this.onFocusButtonIncremental == false) {
          this.showMenuInput = false;
        }
      },
      500
    );
  }

  clearInput() {

    // this.productsAux[this.indexCardProductNow].amount = 0;

  }

  clickOk() {
    this.showMenuInput = false;
  }

  goPay() {
    this.navigation.forward('app/ecommerce/basket/store-pickup');
  }

  goBack() {
    this.navigation.back('app/ecommerce/home/detail-product');
  }
}

