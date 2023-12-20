import { Component, Injector, NgZone, OnDestroy } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ApiException, AppConfigurationService, GeolocationService, ViewComponent } from '@geor360/core';
import { GoogleServiceProxy } from '@shared/proxies/profile/google.proxies';
import { Subscription } from 'rxjs';
import { GoogleMapService } from '../../services/google-maps/google-map.service';
import { AddAddressComponent } from '../../../modals/add-address/add-address.component';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'map-desktop.component.html',
  styleUrls: [
    'map-desktop.component.scss',
    '../base/map-base.component.scss'
  ],
  host: { 'app.map-desktop': 'true' }
})
export class MapDesktopComponent extends ViewComponent implements OnDestroy {

  private _appConfigurationService: AppConfigurationService;
  private _animationModalservice: AnimationModalService;
  private _googleServiceProxy: GoogleServiceProxy;
  private _geolocationService: GeolocationService;
  private _googleMapService: GoogleMapService;
  private _positionLoaded: Subscription | undefined;
  private _mapLoaded: Subscription | undefined;
  private _ngZone: NgZone;

  address: string = '';
  latitude: number = 0;
  longitude: number = 0;
  edit: boolean = false;
  mapIddle: boolean = false;
  map!: google.maps.Map;
  id: string = '';
  placeId: string = '';

  constructor(_injector: Injector) {
    super(_injector);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._animationModalservice = _injector.get(AnimationModalService);
    this._googleServiceProxy = _injector.get(GoogleServiceProxy);
    this._googleMapService = _injector.get(GoogleMapService);
    this._geolocationService = _injector.get(GeolocationService);
    this._ngZone = _injector.get(NgZone);
    this.loadMap();
  }

  get enterAnimation() {
    return this._appConfigurationService.screen() === 'mobile'
      ? undefined
      : this._animationModalservice.openDesktopModal;
  }

  get leaveAnimation() {
    return this._appConfigurationService.screen() === 'mobile'
      ? undefined
      : this._animationModalservice.closeDesktopModal;
  }

  get modalClasses() {
    return this._appConfigurationService.screen() === 'mobile'
      ? ['modal-custom', 'modal-custom--full']
      : ['modal-custom', 'modal-custom--in-center-medium'];
  }

  async loadMap() {
    this._ngZone.run(async () => {
      const loader = await this.loader.show();
      Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 })
        .then(async (position) => {
          if (position === null) {
            this.message.error('No se pudo obtener la ubicación', 'Error');
            return;
          }
          loader.dismiss();
          const { latitude, longitude } = position.coords;
          this.latitude = latitude;
          this.longitude = longitude;
          this._googleMapService.init();
          this.loadPosition();
          await this.getAddress(latitude, longitude);
        }).catch((err) => {
          console.error(err);
        });
    });
  }

  async getAddress(latitude: number, longitude: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._googleServiceProxy.getGeoCode(latitude, longitude)
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

  async loadPosition() {
    if (this.latitude && this.longitude) {
      if (this.edit) {
        this.startMapEdit();
      } else {
        this.startMapLoading();
      }
    } else {
      this._positionLoaded = this._geolocationService.newPosition
        .subscribe(() => {
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
    this._googleMapService.createMarker(this.map, { latitude: this.latitude, longitude: this.longitude });
  }

  openSearchAddressModal() {
    this.dialog.showWithData({
      component: AddAddressComponent,
      showBackdrop: false,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: this.modalClasses
    }).then((res: any) => {
      if (res.data.result !== 'cancel') {
        const { description, place_id } = res.data.result;
        this.placeId = place_id;
        this.getAddressByPlaceId();
        this.address = description;
      }
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
        error: (error: ApiException) => {
          console.error(error);
          this.message.exception(error);
        }
      });
  }

  dismiss() {
    this.dialog.dismiss('cancel');
  }

  confirm() {
    this.dialog.dismiss({ address: this.address });
  }

  ngOnDestroy() {
    this._positionLoaded?.unsubscribe();
    this._mapLoaded?.unsubscribe();
    this._googleMapService.loadingSubscription.unsubscribe();
  }
}