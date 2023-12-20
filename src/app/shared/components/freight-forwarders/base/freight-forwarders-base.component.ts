import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { ShippingServiceProxy } from '@shared/proxies/public/shipping.proxie';
import { map } from 'rxjs';
import { MyAddressesDesktopComponent, MyAddressesMobileComponent } from 'src/app/ecommerce/basket/modals/my-addresses';
import { Address, AddressService } from 'src/app/ecommerce/profile/address/services/address.service';
import { ModalCountryComponent } from 'src/app/shared/components';

interface Agency {
  lead_time: number;
  price: number;
  logo: string;
  name: string;
}

@Component({
  templateUrl: 'freight-forwarders-base.component.html',
  styleUrls: ['freight-forwarders-base.component.scss'],
  host: { 'freight-forwarders-base': 'true' }
})
export class FreightForwardersBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _activateRoute: ActivatedRoute;
  private _appConfigurationService: AppConfigurationService;
  private _addressService: AddressService;
  private _shippingServiceProxy: ShippingServiceProxy;
  _toolbar: AppTabService;

  @Input() type: 'modal' | 'page' = 'page';
  @Input() usedAsModal: boolean = false;
  @Input() id: string = '';
  @Input() shoppingCart: boolean = false;
  @Input() selectAddressOption: any

  address: Address = {
    address: '',
    country: '',
    default: false,
    description: '',
    extra: [],
    id: 0,
    postal_code: ''
  };
  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };
  agencies: Agency[] = [];
  productId: string = '';
  loading: boolean = false
  available: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
    this._activateRoute = _injector.get(ActivatedRoute);
    this._addressService = _injector.get(AddressService);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._shippingServiceProxy = _injector.get(ShippingServiceProxy);
    this._toolbar = _injector.get(AppTabService);
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

  ngOnInit() {
    const { id } = this._activateRoute.snapshot.params;
    this.productId = id === undefined ? this.id : id;
    this.setDefaultAddress();
  }

  ionViewWillEnter() {
    this._toolbar.hide();
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
        this.available = false

      }
    } else {
      this.address = this.selectAddressOption
      this.shoppingCart
        ? this.calculateShoppingCartPrices(this.address.extra[2].ubigeo)
        : this.calculatePrices(this.address.extra[2].ubigeo);
    }
  }

  calculatePrices(ubigeo?: string) {
    this.loading = false
    this.available = true
    this._shippingServiceProxy.getCalculateProduct('AGENCIA', this.productId, ubigeo)
      .subscribe({
        next: (response) => {
          if (response.data.length === 0) {
            this.loading = true
            this.available = false;
            return;
          }
          this.loading = true
          this.available = true;
          this.agencies = response.data;
        },
        error: (error: ApiException) => {
          this.available = false
          this.loading = false
          this.message.exception(error)
        }
      });
  }

  calculateShoppingCartPrices(ubigeo?: string) {
    this.loading = false
    this.available = true
    this._shippingServiceProxy.getCalculate('AGENCIA', undefined, undefined, ubigeo)
      .pipe(
        map(response => response.data.type)
      ).subscribe({
        next: (response) => {
          if (response.length === 0) {
            this.loading = true
            this.available = false;
            return;
          }
          this.loading = true
          this.available = true;
          this.agencies = response.map(({ price, subtotal, total, ...rest }: any) => ({ price: total, ...rest }));
        },
        error: (error: ApiException) => {
          this.agencies = [];
          this.available = false
          this.loading = false

        }
      });

  }

  openCountriesModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryId: this.country.id,
        countryCode: this.country.id
      },
      cssClass: this.modalClasses
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }

  chooseAddress() {
    this.dialog.showWithData({
      component: this.addressModal,
      componentProps: {
        usedAsModal: true,
        selectedAddress: this.address,
        productId: this.productId
      },
      cssClass: this.modalClasses
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

  termsAndConditions() {
    this.dialog.dismiss('cancel');
    this._appConfigurationService.screen() === 'desktop'
      ? this.navigation.forwardNoAnimation('/app/ecommerce/home/terms-and-conditions-of-shipment')
      : this.navigation.forward('/app/ecommerce/home/terms-and-conditions-of-shipment');
  }

  back() {
    if (!this.type) {
      const { id, description } = this._activateRoute.snapshot.params;
      this.navigation.back(`/app/ecommerce/home/detail-product/${id}/${description}`);
    } else {
      this.dialog.dismiss('cancel');
    }
  }

}
