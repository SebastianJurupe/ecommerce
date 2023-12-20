import { Component, ElementRef, Injector, Renderer2, ViewChild } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { Platform, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { ImageProductCompleteMobileComponent } from '../../modals/image-product-complete';
import { ShareComponent } from '../../modals/share/share.component';

@Component({
  templateUrl: 'detail-product-tablet.component.html',
  styleUrls: ['detail-product-tablet.component.scss'],
  host: { 'app.detail-product-tablet': 'true' }
})
export class DetailProductTabletComponent extends ViewComponent implements ViewWillEnter, ViewWillLeave {

  private _toolbar: AppTabService;
  private _renderer2: Renderer2;
  private _platform: Platform;
  private _configuration: AppConfigurationService;

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  isTypesHidden = false;
  hearthIconClass = 'hearth icon icon--heart-outline';
  selectedProductIndex = -1;
  selectedProductType: string = 'variants';
  showOnlyFirstPrice = false;
  showPrices = false;
  product: any;
  prices: any[] = [];
  device: string;
  showDetailComponent: boolean = false;
  showSwiper: boolean = false;
  showExchanges: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._toolbar = _injector.get(AppTabService);
    this._configuration = _injector.get(AppConfigurationService);
    this._renderer2 = _injector.get(Renderer2);
    this._platform = _injector.get(Platform);
    this.device = this._configuration.screen();
  }

  ionViewWillEnter(): void {
    this._toolbar.hide();
    const appRoot = document.getElementById('app-root');
    this._renderer2.removeClass(appRoot, 'safe-area-top');
    if (this._platform.is('cordova') || this._platform.is('capacitor')) {
      StatusBar.hide();
    }
  }

  selectProduct(index: number) {
    this.selectedProductIndex = index;
    if (this.swiperContainer && this.swiperContainer.nativeElement.swiper) {
      this.swiperContainer.nativeElement.swiper.slideTo(index);
    }
  }

  openVariants() {
    this.navigation.forward('/app/ecommerce/home/variants');
  }

  openChat() {
    this.navigation.forward('/app/ecommerce/home/messages');
  }

  navigateToReturns() {
    this.showExchanges = !this.showExchanges;
  }

  openDetailsTablet() {
    this.showDetailComponent = !this.showDetailComponent;
  }

  changeIcon() {
    if (this.hearthIconClass.includes('icon--heart-outline')) {
      this.hearthIconClass = 'hearth icon icon--heart-fill icon--delete';
    } else {
      this.hearthIconClass = 'hearth icon icon--heart-outline';
    }
  }

  toggleTypesVisibility() {
    this.isTypesHidden = !this.isTypesHidden;
  }

  share() {
    this.dialog.showWithData({
      component: ShareComponent,
      componentProps: {
        description: 'http://wehouse.com/oscarort...',
      },
      cssClass: ['modal-custom', 'modal-custom--in-center-medium']
    });
  }

  homeDelivery() {
    this.navigation.forward('/app/ecommerce/home/home-delivery');
  }

  freightForwardersDelivery() {
    this.navigation.forward('/app/ecommerce/home/freight-forwarders');
  }

  storesDelivery() {
    this.navigation.forward('/app/ecommerce/home/stores');
  }

  ionViewWillLeave() {
    const appRoot = document.getElementById('app-root');
    this._renderer2.addClass(appRoot, 'safe-area-top');
    if (this._platform.is('cordova') || this._platform.is('capacitor')) {
      StatusBar.show();
    }
  }

  goBasket() {
    this.navigation.forward('app/ecommerce/basket');
  }

  openImgProduct() {
    this.dialog.showWithData({
      component: ImageProductCompleteMobileComponent,
      cssClass: ['modal-custom', 'modal-custom--full']
    });
  }

  back() {
    this.navigation.back('app/ecommerce/home/home');
    this._toolbar.show();
  }
}
