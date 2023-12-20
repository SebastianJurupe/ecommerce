import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService } from "@geor360/core";

@Injectable()
export class GoogleServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  getPlacePrediction(filter: string) {
    let url = `${this.path}/api/services/app/Google/GetPlacePrediction`;

    if (filter !== undefined && filter !== null) {
      url += '?Filter=' + encodeURIComponent('' + filter);
    }

    url.replace(/[?&]$/, "");

    return this.request.get(url);
  }

  getGeoCode(latitude: number, longitude: number) {
    let url = `${this.path}/api/services/app/Google/GetGeocode`;

    if (latitude !== undefined && latitude !== null) {
      url += '?Latitude=' + encodeURIComponent('' + latitude);
    }

    if (longitude !== undefined && longitude !== null) {
      url += '&Longitude=' + encodeURIComponent('' + longitude);
    }

    url.replace(/[?&]$/, "");

    return this.request.get(url);
  }

  getPlaceId(placeId: string) {
    let url = `${this.path}/api/services/app/Google/GetPlaceId`;

    if (placeId !== undefined && placeId !== null) {
      url += '?PlaceId=' + encodeURIComponent('' + placeId);
    }

    url.replace(/[?&]$/, "");

    return this.request.get(url);
  }

  getToken() {
    let url = `${this.path}/api/services/app/Google/GetToken`;

    return this.request.get(url);
  }
}