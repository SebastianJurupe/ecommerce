import { Component, Injector, NgZone, OnDestroy, OnInit } from '@angular/core';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { AppTabService, GeolocationService, ViewComponent } from '@geor360/core';
import { Platform, ViewWillEnter } from '@ionic/angular';
import { GoogleServiceProxy } from '@shared/proxies/profile/google.proxies';
import { Subscription } from 'rxjs';
import { AddAddressComponent } from '../../../modals/add-address/add-address.component';
import { AddressService } from '../../services/address.service';
import { GoogleMapService } from '../../services/google-maps/google-map.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'map-mobile.component.html',
  styleUrls: [
    'map-mobile.component.scss',
    '../base/map-base.component.scss'
  ],
  host: { 'app.map-mobile': 'true' }
})
export class MapMobileComponent extends ViewComponent implements OnInit, ViewWillEnter, OnDestroy {

  private _activatedRoute: ActivatedRoute;
  private _addressService: AddressService;
  private _geolocationService: GeolocationService;
  private _googleMapService: GoogleMapService;
  private _googleServiceProxy: GoogleServiceProxy;
  private _locationAccuracy: LocationAccuracy;
  private _mapLoaded: Subscription | undefined;
  private _ngZone: NgZone;
  private _platform: Platform;
  private _positionLoaded: Subscription | undefined;
  private _toolbar: AppTabService;

  addressId: string = '';
  address: string = '';
  loading!: HTMLIonLoadingElement;
  mapIddle: boolean = false;

  latitude: number = 0;
  longitude: number = 0;
  placeId: string = '';

  edit: boolean = false;
  map!: google.maps.Map;
  mobile: boolean = this.configuration.screen() == 'mobile';
  showSearchAddress: boolean = false;
  showAssignAddress: boolean = false;

  showFooter: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._addressService = _injector.get(AddressService);
    this._geolocationService = _injector.get(GeolocationService);
    this._googleMapService = _injector.get(GoogleMapService);
    this._googleServiceProxy = _injector.get(GoogleServiceProxy);
    this._locationAccuracy = _injector.get(LocationAccuracy);
    this._ngZone = _injector.get(NgZone);
    this._platform = _injector.get(Platform);
    this._toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    const { id } = this._activatedRoute.snapshot.queryParams;
    this.addressId = id;
  }

  async ionViewWillEnter() {
    this._toolbar.hide();
    if (this._platform.is('capacitor') && this._platform.is('android')) {
      const turnGPS = await this.turnGPS();

      if (turnGPS) {
        const loader = await this.loader.show();

        Geolocation.getCurrentPosition({ enableHighAccuracy: true })
          .then(async (position) => {
            if (position === null) {
              this.message.error('No se pudo obtener la ubicación', 'Error');
              return;
            }
            loader.dismiss();
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this._geolocationService.init();
            this._googleMapService.init();
            this.loadPosition();
            await this.getAddress();
          });
      }
    } else {
      await this._platform.ready().then(async (platform) => {

        if (platform === 'cordova') {

          navigator.geolocation.getCurrentPosition(async (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this._geolocationService.init();
            this._googleMapService.init();
            this.loadPosition();
            await this.getAddress();
          });
        } else {
          navigator.geolocation.getCurrentPosition(async (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this._geolocationService.init();
            this._googleMapService.init();
            this.loadPosition();
            await this.getAddress();
          });
        }
      });
    }
  }

  async getAddress(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._googleServiceProxy.getGeoCode(this.latitude, this.longitude)
        .subscribe({
          next: (response) => {
            this._ngZone.run(() => {
              this.address = response.results[0].formatted_address;
              resolve(response.results[0].formatted_address);
            });
          },
          error: (error) => {
            reject(error);
          }
        });

    });
  }

  getAddressByPlaceId() {
    this._googleServiceProxy.getPlaceId(this.placeId)
      .subscribe({
        next: (response) => {
          this._ngZone.run(() => {
            this.address = response.result.formatted_address;
            this.latitude = response.result.geometry.location.lat;
            this.longitude = response.result.geometry.location.lng;
            this.loadPosition();
          });
        },
        error: (error) => {
          console.error(error);
          this.message.exception(error);
        }
      });
  }

  async onMapLoaded() {
    if (!this.latitude) {
      this._googleMapService.createMarker(this.map, { latitude: this.latitude, longitude: this.longitude });
      this.getAddress();
    } else {
      this._googleMapService.createMarker(this.map, { latitude: this.latitude, longitude: this.longitude });
    }
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

  async turnGPS(): Promise<boolean> {

    try {
      await this._locationAccuracy.request(this._locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      return true;
    } catch (error) {
      return false;
    }
  }

  openSearchAddressModal() {
    this.dialog.showWithData({
      component: AddAddressComponent,
      cssClass: ['modal-custom', 'modal-custom--full']
    }).then((res: any) => {
      if (res.data.result !== 'cancel') {
        const { description, place_id } = res.data.result;
        this.placeId = place_id;
        this.getAddressByPlaceId();
        this.address = description;
      }
    });
  }

  confirm() {
    if (this.address === '') { return; }
    this._addressService.set(this.address);
    this.navigation.forward('/app/ecommerce/profile/address-form', { id: this.addressId });
  }

  back() {
    this.showFooter = false;
    setTimeout(() => this.navigation.back('/app/ecommerce/profile/address-form', { id: this.addressId }), 100);
  }

  ngOnDestroy() {
    this.showFooter = false;
    this._positionLoaded?.unsubscribe();
    this._mapLoaded?.unsubscribe();
  }
}
