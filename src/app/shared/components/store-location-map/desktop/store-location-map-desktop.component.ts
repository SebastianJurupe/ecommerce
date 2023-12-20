import { Component } from '@angular/core';
import { StoreLocationMapBaseComponent } from '../base/store-location-map-base.component';

@Component({
  templateUrl: 'store-location-map-desktop.component.html',
  styleUrls: [
    'store-location-map-desktop.component.scss',
    '../base/store-location-map-base.component.scss'
  ]
})
export class StoreLocationMapDesktopComponent extends StoreLocationMapBaseComponent {

  async ionViewWillEnter() {
    this._toolbar.show();
    const { latitude, longitude } = this._activatedRoute.snapshot.queryParams;

    if (latitude !== undefined && latitude !== undefined) {
      this.latitude = +latitude;
      this.longitude = +longitude;
    } else {
      this.latitude = +this.latitudeProp;
      this.longitude = +this.longitudeProp;
    }
    this.getPlaceByLatAndLong();
    this.loadMap();
  }
  override back() {
    this.dialog.dismiss('cancel');
  }

  override confirm() {
    this.dialog.dismiss('cancel');
  }
}