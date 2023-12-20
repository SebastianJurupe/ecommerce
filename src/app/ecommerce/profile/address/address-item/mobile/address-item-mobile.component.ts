import { Component } from '@angular/core';
import { AddressItemBaseComponent } from '../base/address-item-base.component';



@Component({
  selector: 'address-item-mobile',
  templateUrl: 'address-item-mobile.component.html',
  styleUrls: ['address-item-mobile.component.scss'],
  host: { 'app.address-item-mobile': 'true' }
})
export class AddressItemMobileComponent extends AddressItemBaseComponent { }
