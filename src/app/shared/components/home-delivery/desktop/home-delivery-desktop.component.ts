import { Component } from '@angular/core';
import { HomeDeliveryBaseComponent } from '../base/home-delivery-base.component';

@Component({
  templateUrl: 'home-delivery-desktop.component.html',
  styleUrls: ['home-delivery-desktop.component.scss'],
})
export class HomeDeliveryDesktopComponent extends HomeDeliveryBaseComponent {

  override ionViewWillEnter() {
    if (!this.detail) {
      this.toolbar.show();
    }
  }

}
