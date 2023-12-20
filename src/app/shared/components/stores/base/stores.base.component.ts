
import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalCountryComponent, StoreLocationMapDesktopComponent } from '@shared/components';
import { ShippingServiceProxy } from '@shared/proxies/public/shipping.proxie';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { map } from 'rxjs';
import { MyAddressesDesktopComponent, MyAddressesMobileComponent } from 'src/app/ecommerce/basket/modals/my-addresses';
import { Address, AddressService } from 'src/app/ecommerce/profile/address/services/address.service';
@Component({
  templateUrl: 'stores-base.component.html',
  styleUrls: ['stores-base.component.scss'],
  host: { 'stores-base': 'true' }
})
export class StoresBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _animationModalService: AnimationModalService;
  private _addressService: AddressService;
  private _appConfigurationService: AppConfigurationService;
  private _activateRoute: ActivatedRoute;
  private _shippingServiceProxy: ShippingServiceProxy;

  @Input() type: 'modal' | 'page' = 'page';
  @Input() id: string = '';
  @Input() shoppingCart: boolean = false;
  @Input() detail: boolean = false;
  @Input() selectAddressOption: any;

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
  stores: any[] = [];
  loading: boolean = false;
  available: boolean = true;
  toolbar: AppTabService;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._addressService = _injector.get(AddressService);
    this.toolbar = _injector.get(AppTabService);
    this._activateRoute = _injector.get(ActivatedRoute);
    this._shippingServiceProxy = _injector.get(ShippingServiceProxy);
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

  async setDefaultAddress() {
    if (this.selectAddressOption.id === 0) {
      const address = await this._addressService.getDefault();
      if (address.address !== '') {
        this.address = address;
        this.shoppingCart
          ? this.calculateShoppingCartPrices()
          : this.calculatePrices();
      } else {
        this.available = false;

      }
    } else {
      this.address = this.selectAddressOption;
      this.shoppingCart
        ? this.calculateShoppingCartPrices(this.address.extra[2].ubigeo)
        : this.calculatePrices(this.address.extra[2].ubigeo);
    }

  }

  openCountriesModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryId: this.country.id,
        countryCode: this.country.id
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: this.modalClasses,
      showBackdrop: false,
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }

  calculateShoppingCartPrices(ubigeo?: string) {
    this.loading = false;
    this.available = true;
    this._shippingServiceProxy.getCalculate('TIENDA', undefined, undefined, ubigeo)
      .pipe(
        map(response => response.data.type)
      ).subscribe({
        next: (response) => {
          if (response.length === 0) {
            this.loading = true;
            this.available = false;
            return;
          }
          this.stores = response;
          this.loading = true;
          this.available = true;
        },
        error: (error: ApiException) => this.message.exception(error)
      });
  }

  calculatePrices(ubigeo?: string) {
    this.loading = false;
    this.available = true;
    this._shippingServiceProxy.getCalculateProduct('TIENDA', this.productId, ubigeo)
      .subscribe({
        next: (response) => {
          if (response.data.length === 0) {
            this.loading = true;
            this.available = false;
            return;
          }
          this.stores = response.data;
          this.loading = true;
          this.available = true;
        },
        error: () => {
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
      cssClass: this.modalClasses,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      showBackdrop: false,
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        const address = response.data.result as Address;
        if (address.country !== 'PE') return;
        this.address = address;
        this.shoppingCart
          ? this.calculateShoppingCartPrices(address.extra[2].ubigeo)
          : this.calculatePrices(address.extra[2].ubigeo);
      }
    });
  }

  openMap(latitude: string, longitude: string) {
    this.openModalMap(latitude, longitude);
  }

  openModalMap(latitude: string, longitude: string) {
    this.dialog.showWithData({
      component: StoreLocationMapDesktopComponent,
      componentProps: {
        latitudeProp: latitude,
        longitudeProp: longitude,
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      showBackdrop: false,
      cssClass: this.modalClasses,
    });
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