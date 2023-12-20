import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { Address, AddressService } from '../../services/address.service';

@Component({
  templateUrl: 'list-address-base.component.html',
  styleUrls: ['list-address-base.component.scss'],
  host: { 'app.list-address-base': 'true' }
})
export class ListAddressBaseComponent extends ViewComponent implements OnInit {

  addresses: Address[] = [];
  addressService: AddressService;
  emptyAddress: boolean = false
  loading: boolean = true

  constructor(_injector: Injector) {
    super(_injector);
    this.addressService = _injector.get(AddressService);
  }

  ngOnInit() {
    this.loading = true
    this.addressService.getAll().then(() => {
      this.addressService.addresses$.subscribe(res => {
        this.loading = false
        this.addresses = res;
        if (this.addresses.length === 0) {
          this.emptyAddress = true
        }
      });
    })
  }
}