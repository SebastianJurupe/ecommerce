import { Component, Injector, OnInit } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter } from '@ionic/angular';
import { DeleteAddressComponent } from '../../../modals/delete-address/delete-address.component';
import { AddressItemEmitterOptionClicked } from '../../address-item';
import { OptionAddressPopoverComponent } from '../../option-address-popover/option-address-popover.component';
import { Address, AddressService } from '../../services/address.service';

@Component({
  templateUrl: 'list-address-mobile.component.html',
  styleUrls: ['list-address-mobile.component.scss'],
  host: { 'app.list-address-mobile': 'true' }
})

export class ListAddressMobileComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _addressService: AddressService;
  private _popoverController: PopoverController;
  private _toolbar: AppTabService;

  addresses: Address[] = [];
  emptyAddress: boolean = false
  loading: boolean = true

  constructor(_injector: Injector) {
    super(_injector);
    this._addressService = _injector.get(AddressService);
    this._popoverController = _injector.get(PopoverController);
    this._toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    this.loading = true
    this._addressService.getAll().then(() => {
      this._addressService.addresses$.subscribe(res => {
        this.loading = false
        this.addresses = res;
        if (this.addresses.length === 0) {
          this.emptyAddress = true
        }
      });
    })
  }

  ionViewWillEnter() {
    this._toolbar.hide();
  }

  async onOpenPopover(emitter: AddressItemEmitterOptionClicked) {
    const { id, event } = emitter;
    const popover = await this._popoverController.create({
      component: OptionAddressPopoverComponent,
      event: event,
      alignment: 'end',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        id: id
      },
      cssClass: ['address-popover']
    });

    await popover.present();

    const res = await popover.onDidDismiss();
    if (res.data.option === 'edit') {
      this.navigation.forward('/app/ecommerce/profile/address-form', { id: id })
    } else {
      this.onDelete(res.data.id);
    }
  }

  onDelete(id: number) {
    this.dialog.showWithData({
      component: DeleteAddressComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    }).then(async (res) => {
      if (res.data.result !== 'cancel') {

        const deleted = await this._addressService.deleteById(id);

        if (deleted) {
          const message: string = this.localization.localize('profile.address.deleteAddress.succesfullyDeleted', 'ecommerce');
          this.notify.success(message, 2500);
        }
      }
    });
  }

  onAddAddress() {
    this.navigation.forward('/app/ecommerce/profile/address-form');
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/home');
    this._toolbar.show();
  }
}
