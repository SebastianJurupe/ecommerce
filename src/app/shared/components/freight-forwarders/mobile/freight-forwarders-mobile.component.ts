import { Component } from '@angular/core';
import { FreightForwardersBaseComponent } from '../base/freight-forwarders-base.component';

@Component({
  templateUrl: 'freight-forwarders-mobile.component.html',
  styleUrls: ['freight-forwarders-mobile.component.scss'],
  host: { 'freight-forwarders-mobile': 'true' }
})
export class FreightForwardersMobileComponent extends FreightForwardersBaseComponent {
  confirmAgency(agency: any) {
    let agencyData = {
      agency: agency,
      address: this.address
    }
    this.dialog.dismiss(agencyData)
  }


  override ionViewWillEnter() {
    this._toolbar.hide();
  }
}