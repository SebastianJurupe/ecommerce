import { Component, Injector, Input, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AppTabService, GeolocationService, ViewComponent } from '@geor360/core';
import { GoogleServiceProxy } from '@shared/proxies/profile/google.proxies';
import { Subscription } from 'rxjs';
import { GoogleMapService } from 'src/app/ecommerce/profile/address/services/google-maps/google-map.service';

@Component({
  templateUrl: 'store-location-map-base.component.html',
  styleUrls: ['store-location-map-base.component.scss']
})
export class StoreLocationMapBaseComponent extends ViewComponent {

  _activatedRoute: ActivatedRoute;
  private _geolocationService: GeolocationService;
  private _googleMapService: GoogleMapService;
  private _googleServiceProxy: GoogleServiceProxy;
  private _mapLoaded: Subscription | undefined;
  private _positionLoaded: Subscription | undefined;
  private _ngZone: NgZone;
  _toolbar: AppTabService;

  @Input() latitudeProp: string = '';
  @Input() longitudeProp: string = '';

  map!: google.maps.Map;
  mapIddle: boolean = false;
  showFooter: boolean = true;
  latitude: number = 0;
  longitude: number = 0;
  edit: boolean = false;

  ecommerceAddressName: string = '';

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._geolocationService = _injector.get(GeolocationService);
    this._googleMapService = _injector.get(GoogleMapService);
    this._googleServiceProxy = _injector.get(GoogleServiceProxy);
    this._ngZone = _injector.get(NgZone);
    this._toolbar = _injector.get(AppTabService);
  }



  async loadMap() {
    this._ngZone.run(() => {
      this._googleMapService.init();
      this.loadPosition();
    });
  }

  async loadPosition() {
    if (this.latitude && this.longitude) {
      if (this.edit) {
        this.startMapEdit();
      } else {
        this.startMapLoading();
      }
    } else {
      this._positionLoaded = this._geolocationService.newPosition.subscribe(() => {
        this._positionLoaded?.unsubscribe();
        if (this.edit) {
          this.startMapEdit();
        } else {
          this.startMapLoading();
        }
      });
    }
  }

  startMapEdit() {
    this.completeLoadMap();
    this._mapLoaded = this._googleMapService.loadingSubscription.subscribe(() => {
      this._mapLoaded?.unsubscribe();
      this.completeLoadMap();
    });
  }

  startMapLoading() {
    if (this._googleMapService.loaded) {
      this.completeLoadMap();
    } else {
      this._mapLoaded = this._googleMapService.loadingSubscription.subscribe(() => {
        this._mapLoaded?.unsubscribe();
        this.completeLoadMap();
      });
    }
  }

  async completeLoadMap() {
    this._mapLoaded?.unsubscribe();

    const loader = await this.loader.show();
    const divMap = document.getElementById('map') as HTMLDivElement;

    this.map = this._googleMapService.createMap(
      divMap,
      this.latitude,
      this.longitude,
      () => {
        loader.dismiss();
        this.mapIddle = true;
        this.onMapLoaded();
      }
    );
  }

  async onMapLoaded() {
    const { latitude, longitude } = await this.getUserCurrentyPosition();

    const marker1 = this._googleMapService.createEcommerceMarker(this.map, { latitude: this.latitude, longitude: this.longitude });
    const marker2 = this._googleMapService.createMarker(this.map, { latitude, longitude });
    this._googleMapService.fitBounds(this.map, marker1, marker2);
  }

  getUserCurrentyPosition(): Promise<{ latitude: number, longitude: number; }> {
    return new Promise(async (resolve, reject) => {
      try {
        const { coords: { latitude, longitude } } = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        resolve({ latitude, longitude });
      } catch (error) {
        reject(error);
      }
    });
  }

  getPlaceByLatAndLong() {
    this._googleServiceProxy.getGeoCode(this.latitude, this.longitude)
      .subscribe({
        next: (response) => {
          this.ecommerceAddressName = response.results[0].formatted_address;
        },
        error: (error) => {
          this.message.exception(error);
        }
      });
  }

  confirm() { }

  back() {
    this.showFooter = false;
    const { productId, description } = this._activatedRoute.snapshot.queryParams;
    setTimeout(() => this.navigation.back(`/app/ecommerce/home/stores/${productId}/${description}`), 100);
  }

  ngOnDestroy() {
    this.showFooter = false;
    this._positionLoaded?.unsubscribe();
    this._mapLoaded?.unsubscribe();
  }
}