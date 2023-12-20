import { Component } from '@angular/core';
import { StoresBaseComponent } from '../base/stores.base.component';

@Component({
  templateUrl: 'stores-desktop.component.html',
  styleUrls: ['stores-desktop.component.scss'],
  host: { 'stores-desktop': 'true' }
})
export class StoresDesktopComponent extends StoresBaseComponent {

  chooseStore(store: any) {
    let storeData = {
      store: store,
      address: this.address
    };
    this.dialog.dismiss(storeData);
  }
  override ionViewWillEnter() {
    if (!this.detail) {
      this.toolbar.show();
    }
  }
}
