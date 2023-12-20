import { Component } from '@angular/core';
import { MyAddressesBaseComponent } from '../base/my-addresses-base.component';

@Component({
  templateUrl: 'my-addresses-desktop.component.html',
  styleUrls: ['my-addresses-desktop.component.scss'],
  host: { 'app.my-addresses-desktop': 'true' }
})
export class MyAddressesDesktopComponent extends MyAddressesBaseComponent { }