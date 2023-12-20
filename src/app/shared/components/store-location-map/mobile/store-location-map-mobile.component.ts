import { Component } from '@angular/core';
import { StoreLocationMapBaseComponent } from '../base/store-location-map-base.component';

@Component({
  templateUrl: 'store-location-map-mobile.component.html',
  styleUrls: [
    'store-location-map-mobile.component.scss',
    '../base/store-location-map-base.component.scss'
  ]
})
export class StoreLocationMapMobileComponent extends StoreLocationMapBaseComponent {
  async ionViewWillEnter() {
    this._toolbar.hide();
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
}