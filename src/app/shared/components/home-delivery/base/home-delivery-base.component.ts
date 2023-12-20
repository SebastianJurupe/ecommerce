import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { ShippingServiceProxy } from '@shared/proxies/public/shipping.proxie';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { MyAddressesDesktopComponent, MyAddressesMobileComponent } from 'src/app/ecommerce/basket/modals/my-addresses';
import { Address, AddressService } from 'src/app/ecommerce/profile/address/services/address.service';

export interface SendType {
  id: string;
  classIconButton: string;
  label: string;
  details: string;
  isBestPrice: boolean;
  type: string;
  price: number;
  shapeIconBackground: string;
}
@Component({
  templateUrl: 'home-delivery-base.component.html',
  styleUrls: ['home-delivery-base.component.scss'],
  host: { 'home-delivery-base': 'true' }
})
export class HomeDeliveryBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _animationModalService: AnimationModalService;
  private _appConfigurationService: AppConfigurationService;
  private _addressService: AddressService;
  private _activateRoute: ActivatedRoute;
  private _shippingServiceProxy: ShippingServiceProxy;


  @Input() deliveryTypeId: string = '01';
  @Input() detail: boolean = false;
  @Input() id: string = '';
  @Input() shoppingCart: boolean = false;
  @Input() type: 'modal' | 'page' = 'page';
  @Input() selectAddressOption: any
  toolbar: AppTabService;
  loading: boolean = false;
  available: boolean = true;
  address: Address = {
    id: 0,
    address: '',
    country: '',
    default: false,
    description: '',
    extra: [],
    postal_code: '',
  };
  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };
  productId: string = '';
  productDescription: string = '';
  sendTypes: SendType[] = [
    {
      id: '',
      classIconButton: 'icon icon--calendar icon--warn',
      label: this.localization.localize('basket.storePickup.addressRegularShipping','ecommerce'),
      details: '',
      isBestPrice: false,
      type: 'warning',
      shapeIconBackground: 'circle',
      price: 0,
    },
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._activateRoute = _injector.get(ActivatedRoute);
    this._addressService = _injector.get(AddressService);
    this._shippingServiceProxy = _injector.get(ShippingServiceProxy);
    this.toolbar = _injector.get(AppTabService);
  }

  get modalClasses(): string[] {
    return this._appConfigurationService.screen() === 'mobile'
      ? ['modal-custom', 'modal-custom--full']
      : ['modal-custom', 'modal-custom--in-center-medium'];
  }

  get addressModal() {
    return this._appConfigurationService.screen() === 'mobile'
      ? MyAddressesMobileComponent
      : MyAddressesDesktopComponent;
  }

  get enterAnimation() {
    return this._appConfigurationService.screen() === 'mobile'
      ? undefined
      : this._animationModalService.openDesktopModal;
  }

  get leaveAnimation() {
    return this._appConfigurationService.screen() === 'mobile'
      ? undefined
      : this._animationModalService.closeDesktopModal;
  }

  ngOnInit() {
    const { id, description } = this._activateRoute.snapshot.params;
    this.productId = id === undefined ? this.id : id;
    this.productDescription = description === undefined ? this.productDescription : description;
    this.setDefaultAddress();
  }

  ionViewWillEnter() {
    this.toolbar.hide();
  }

  calculatePrices(ubigeo?: string) {
    this.loading = false;
    this.available = true;
    this._shippingServiceProxy.getCalculateProduct('DOMICILIO', this.productId, ubigeo)
      .subscribe({
        next: (response) => {
          if (response.data === null) {
            this.loading = true;
            this.available = false;
            return;
          }
          this.loading = true;
          this.available = true;
          const { lead_time, price } = response.data;
          this.sendTypes[0].details = `${this.localization.localize('basket.storePickup.addressAgency','ecommerce')} ${lead_time} ${this.localization.localize('basket.storePickup.addresItArrivesDay','ecommerce')}`;
          this.sendTypes[0].price = price;
        },
        error: (err: ApiException) => {
          this.available = false;
          this.loading = false;
          this.message.exception(err);
        }
      });
    this._shippingServiceProxy;
  }

  async setDefaultAddress() {
    if (this.selectAddressOption.id === 0) {
      const address = await this._addressService.getDefault();
      if (address.address !== '') {
        this.address = address;
        this.shoppingCart
          ? this.calculateShoppingCartPrice()
          : this.calculatePrices();

      } else {
        this.available = false;

      }
    } else {
      this.address = this.selectAddressOption
      this.shoppingCart
        ? this.calculateShoppingCartPrice(this.address.extra[2].ubigeo)
        : this.calculatePrices(this.address.extra[2].ubigeo);
    }
  }

  calculateShoppingCartPrice(ubigeo?: string) {
    this.loading = false;
    this.available = true;
    this._shippingServiceProxy.getCalculate('DOMICILIO', undefined, undefined, ubigeo)
      .subscribe({
        next: (response) => {
          if (response.data === null) {
            this.loading = true;
            this.available = false;
            return;
          }
          this.loading = true;
          this.available = true;
          const { type: { lead_time }, total } = response.data;
          this.sendTypes[0].details = `${this.localization.localize('basket.storePickup.addressAgency','ecommerce')} ${lead_time} ${this.localization.localize('basket.storePickup.addresItArrivesDay','ecommerce')}`;
          this.sendTypes[0].price = total;
        },
        error: (err: ApiException) => {
          this.available = false;
          this.loading = false;
        }
      });
  }

  chooseAddress() {
    this.dialog.showWithData({
      component: this.addressModal,
      componentProps: {
        usedAsModal: true,
        selectedAddress: this.address,
        productId: this.productId,
        detail: this.detail
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      showBackdrop: false,
      cssClass: this.modalClasses
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        const address = response.data.result as Address;
        if (address.country !== 'PE') {
          this.available = false;
          this.loading = false;
          this.address = address;
          return;
        };
        this.address = address;
        this.shoppingCart
          ? this.calculateShoppingCartPrice(address.extra[2].ubigeo)
          : this.calculatePrices(address.extra[2].ubigeo);
      }
    });
  }

  chooseSendType(selectedSendType: SendType) {
    this.deliveryTypeId = selectedSendType.id;
    let delivery = {
      selectedSendType: selectedSendType,
      address: this.address
    };
    if (!this.type) {
    } else {
      this.dialog.dismiss(delivery);
    }
  }

  termsAndConditions() {
    this.dialog.dismiss('cancel');
    this._appConfigurationService.screen() === 'desktop'
      ? this.navigation.forwardNoAnimation('/app/ecommerce/home/terms-and-conditions-of-shipment')
      : this.navigation.forward('/app/ecommerce/home/terms-and-conditions-of-shipment');
  }

  back() {
    if (!this.type) {
      this.navigation.back(`/app/ecommerce/home/detail-product/${this.productId}/${this.productDescription}`);
    } else {
      this.dialog.dismiss('cancel');
    }
  }

}
