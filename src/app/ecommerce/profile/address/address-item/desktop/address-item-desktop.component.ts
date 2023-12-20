import { Component } from '@angular/core';
import { AddressItemBaseComponent } from '../base/address-item-base.component';

@Component({
  templateUrl: 'address-item-desktop.component.html',
  styleUrls: ['address-item-desktop.component.scss'],
  host: { 'app.address-item-desktop': 'true' }
})
export class AddressItemDesktopComponent extends AddressItemBaseComponent { }