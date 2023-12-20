import { Component } from '@angular/core';
import { MyAddressesBaseComponent } from '../base/my-addresses-base.component';

@Component({
  templateUrl: 'my-addresses-mobile.component.html',
  styleUrls: ['my-addresses-mobile.component.scss'],
  host: { 'app.my-addresses-mobile': 'true' }
})
export class MyAddressesMobileComponent extends MyAddressesBaseComponent { }