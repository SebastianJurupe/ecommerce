import { Component } from '@angular/core';
import { StoresBaseComponent } from '../base/stores.base.component';

@Component({
  templateUrl: 'stores.mobile.component.html',
  styleUrls: ['stores.mobile.component.scss'],
  host: { 'app.stores': 'true' }
})
export class StoresMobileComponent extends StoresBaseComponent {
  chooseStore(store: any) {
    let storeData = {
      store: store,
      address: this.address
    }
    this.dialog.dismiss(storeData)
  }
}