import { Injectable, Injector } from "@angular/core";
import { AppConfigurationService, ScriptLoaderService } from "@geor360/core";
import { Subject } from "rxjs";
import { IGoogleMapConfiguration, IGoogleMapMarkerSettings } from "./google-map.interfaces";
import { styleMapLight } from "./map.styles";
import { GoogleServiceProxy } from '@shared/proxies/profile/google.proxies';


@Injectable({
  providedIn: 'root',
})
export class GoogleMapService {

  private _configuration: AppConfigurationService;
  private _loader: ScriptLoaderService;
  private _googleServiceProxy: GoogleServiceProxy;

  configuration: IGoogleMapConfiguration = {
    url: 'https://maps.googleapis.com/maps/api/js?',
    icons: {
      location: () => {
        return {
          url: '/assets/icons/markers/location.png',
          size: new google.maps.Size(28, 28),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(8, 8),
        };
      },
    },
    styles: {
      yellow: 'info-location-bottom info-yellow',
      blue: 'info-location-bottom info-blue',
      green: 'info-location-bottom info-green'
    }
  };

  ecommerceConfigurations: IGoogleMapConfiguration = {
    url: 'https://maps.googleapis.com/maps/api/js?',
    icons: {
      location: () => {
        return {
          url: '/assets/icons/markers/renac-marker.png',
          size: new google.maps.Size(28, 28),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(8, 8),
        };
      },
    },
    styles: {
      yellow: 'info-location-bottom info-yellow',
      blue: 'info-location-bottom info-blue',
      green: 'info-location-bottom info-green'
    }
  };

  loadingSubscription: Subject<boolean> = new Subject<boolean>();
  loaded: boolean = false;

  constructor(_injector: Injector) {
    this._configuration = _injector.get(AppConfigurationService);
    this._loader = _injector.get(ScriptLoaderService);
    this._googleServiceProxy = _injector.get(GoogleServiceProxy);
  }

  async init() {
    if (this.loaded) return;

    const token = await this.getToken();
    this._loader.loadScript(`${this.configuration.url}key=${token}&libraries=geometry&language=es`)
      .then(() => {
        this.loadingSubscription.next(true);
        this.loaded = true;
      }).catch(err => console.error({ err }));
  }

  getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._googleServiceProxy.getToken()
        .subscribe({
          next: (response) => {
            resolve(response.token);
          },
          error: (err) => {
            reject(err);
          }
        });
    });
  }

  createMap(element: HTMLElement, latitude: number, longitude: number, iddle: () => void): google.maps.Map {
    const map: google.maps.Map = new google.maps.Map(element, {
      center: new google.maps.LatLng({ lat: latitude, lng: longitude }),
      minZoom: this._configuration.get().google.maps.minZoom,
      zoom: this._configuration.get().google.maps.defaultZoom,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      draggable: true,
      scrollwheel: true,
      fullscreenControl: false,
      disableDoubleClickZoom: false,
      clickableIcons: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styleMapLight,
    });

    google.maps.event.addListenerOnce(map, 'idle', () => iddle());

    return map;
  }

  fitBounds(map: google.maps.Map, marker1: google.maps.Marker, marker2: google.maps.Marker) {
    setTimeout(() => {
      const bounds = new google.maps.LatLngBounds();

      bounds.extend(marker1.getPosition() as google.maps.LatLng);
      bounds.extend(marker2.getPosition() as google.maps.LatLng);

      map.fitBounds(bounds);
    }, 1000);
  }


  getBoundsZoomLevel(bounds: google.maps.LatLngBounds, dimensions: { width: number, height: number; }): number {
    const WORLD_DIM = { height: 256, width: 256 };
    const ZOOM_MAX = 21;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const latFraction = (this.latitudeToRadian(ne.lat()) - this.latitudeToRadian(sw.lat())) / Math.PI;

    const lngDiff = ne.lng() - sw.lng();
    const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    const latZoom = this.boundZoom(dimensions.height, WORLD_DIM.height, latFraction);
    const lngZoom = this.boundZoom(dimensions.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX) - 1.5;
  }

  /**
   * Crea el marcador en el mapa y lo regresa
   * @param map
   * @param settings Latitud y longitud
   * @returns marcador
   */
  createMarker(map: google.maps.Map, settings: IGoogleMapMarkerSettings): google.maps.Marker {
    const marker: google.maps.Marker = new google.maps.Marker({
      position: new google.maps.LatLng({ lat: settings.latitude, lng: settings.longitude }),
      draggable: false,
      map: map,
      icon: this.configuration.icons.location(),
      shape: {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly',
      },
      zIndex: 999,
      optimized: true,
    });

    return marker;
  }

  createEcommerceMarker(map: google.maps.Map, settings: IGoogleMapMarkerSettings): google.maps.Marker {
    const marker: google.maps.Marker = new google.maps.Marker({
      position: new google.maps.LatLng({ lat: settings.latitude, lng: settings.longitude }),
      draggable: false,
      map: map,
      icon: this.ecommerceConfigurations.icons.location(),
      shape: {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly',
      },
      zIndex: 999,
      optimized: true,
    });

    return marker;
  }

  private boundZoom(mapPx: number, worldPx: number, fraction: number) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  private latitudeToRadian(lat: number) {
    let sin = Math.sin(lat * Math.PI / 180);
    let radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  // private paddedBounds(map: google.maps.Map, npad: number, spad: number, epad: number, wpad: number): google.maps.LatLngBounds | null {
  //   const bounds = map.getBounds();
  //   if (!bounds) {
  //     return null;
  //   }

  //   const projection = map.getProjection();
  //   if (!projection) {
  //     return null;
  //   }

  //   const SW = bounds.getSouthWest();
  //   const NE = bounds.getNorthEast();
  //   const topRight = projection.fromLatLngToPoint(NE);
  //   const bottomLeft = projection.fromLatLngToPoint(SW);
  //   const scale = Math.pow(2, map.getZoom());

  //   const SWtopoint = projection.fromLatLngToPoint(SW);
  //   const SWpoint = new google.maps.Point(((SWtopoint.x - bottomLeft.x) * scale) + wpad, ((SWtopoint.y - topRight.y) * scale) - spad);
  //   const SWworld = new google.maps.Point(SWpoint.x / scale + bottomLeft.x, SWpoint.y / scale + topRight.y);
  //   const pt1 = projection.fromPointToLatLng(SWworld);

  //   const NEtopoint = projection.fromLatLngToPoint(NE);
  //   const NEpoint = new google.maps.Point(((NEtopoint.x - bottomLeft.x) * scale) - epad, ((NEtopoint.y - topRight.y) * scale) + npad);
  //   const NEworld = new google.maps.Point(NEpoint.x / scale + bottomLeft.x, NEpoint.y / scale + topRight.y);
  //   const pt2 = projection.fromPointToLatLng(NEworld);

  //   const bound: google.maps.LatLngBounds = new google.maps.LatLngBounds(pt1, pt2);

  //   return bound;
  // }

  // private fitZoom(map: google.maps.Map, point: google.maps.LatLng) {
  //   try {
  //     // reduces the zoom-level of myMap until it contains myPoint
  //     // note that the googlemaps function "contains" works correctly and does not add
  //     // any padding to myPoint
  //     if (!map.getBounds()?.contains(point)) {
  //       map.setZoom(map.getZoom() - 1);
  //       this.fitZoom(map, point);
  //     }
  //   } catch (error) {

}
