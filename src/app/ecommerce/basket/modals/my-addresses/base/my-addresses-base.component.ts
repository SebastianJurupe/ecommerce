import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { FormAddressDesktopComponent, FormAddressMobileComponent } from 'src/app/ecommerce/profile/address/form-address';
import { Address, AddressService } from 'src/app/ecommerce/profile/address/services/address.service';

@Component({
  templateUrl: 'my-addresses-base.component.html',
  styleUrls: ['my-addresses-base.component.scss'],
  host: { 'app.my-addresses-base': 'true' }
})
export class MyAddressesBaseComponent extends ViewComponent implements OnInit {

  private _animationModalService: AnimationModalService;
  private _addressService: AddressService;
  private _appConfigurationService: AppConfigurationService;

  @ViewChild('radioGroup') radioGroup: any;

  @Input() usedAsModal: boolean = false;
  @Input() detail: boolean = false;
  @Input() productId: number = 0;
  @Input() selectedAddress: Address = {
    id: 0,
    address: '',
    country: '',
    default: false,
    description: '',
    extra: [],
    postal_code: '',
  };

  addresses: Address[] = [];
  addressService: AddressService;
  emptyAdress: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this.addressService = _injector.get(AddressService);
    this._addressService = _injector.get(AddressService);
    this._appConfigurationService = _injector.get(AppConfigurationService);
  }

  get isDesktop() {
    return this._appConfigurationService.screen() === 'desktop';
  }

  ngOnInit() {
    this._addressService.addresses$
      .subscribe({
        next: (addresses) => {
          this.addresses = addresses;
          if (this.addresses.length === 0) {
            this.emptyAdress = true;
          }
        },
        error: (err) => console.error(err)
      });
  }

  async setDefault() {
    const address = await this._addressService.getDefault();
    if (address) {
      this.selectedAddress = address;
    }
  }

  addAddress() {
    if (this.usedAsModal && !this.isDesktop) {
      this.dialog.showWithData({
        component: FormAddressMobileComponent,
        componentProps: {
          usedAsModal: true
        },
        cssClass: ['modal-custom', 'modal-custom--full']
      });
    } else {
      this.dialog.showWithData({
        component: FormAddressDesktopComponent,
        componentProps: {
          detail: this.detail
        },
        enterAnimation: this._animationModalService.openDesktopModal,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        showBackdrop: false,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      });
    }
  }

  save() {
    if (!this.usedAsModal) {
      this.addressService.setSelectedAddress(this.selectedAddress.id, this.selectedAddress.address);
      this.navigation.forward("/app/ecommerce/basket/store-pickup");
    } else {
      this.dialog.dismiss(this.selectedAddress);
    }
  }

  editAddress(id: number) {
    if (this.usedAsModal && !this.isDesktop) {
      this.dialog.showWithData({
        component: FormAddressMobileComponent,
        componentProps: {
          id: id,
          usedAsModal: true
        },
        cssClass: ['modal-custom', 'modal-custom--full']
      });
    } else {
      this.dialog.showWithData({
        component: FormAddressDesktopComponent,
        componentProps: {
          id: id,
          detail: this.detail
        },
        enterAnimation: this._animationModalService.openDesktopModal,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        showBackdrop: false,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      });
    }
  }

  selectRadio(address: Address) {
    this.selectedAddress = address;
  }

  close() {
    if (!this.usedAsModal) {
      this.navigation.back('/app/ecommerce/basket/store-pickup');
    } else {
      this.dialog.dismiss('cancel');
    }
  }
}