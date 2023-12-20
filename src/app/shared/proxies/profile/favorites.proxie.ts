import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService } from "@geor360/core";

@Injectable()
export class FavoriteServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  register(id_product: number) {
    const url = `${this.path}/api/services/app/Favorite/Register`;

    const body = JSON.stringify({
      id_product: id_product,
    });

    return this.request.post(url, body);
  }

  getAll() {
    const url = `${this.path}/api/services/app/Favorite/GetAll`;

    return this.request.get(url);
  }

  delete(id_product: number) {
    let url = `${this.path}/api/services/app/Favorite/Delete`;

    if (id_product !== null && id_product !== undefined) {
      url += "?id_product=" + encodeURIComponent("" + id_product) + "&";
    }

    url.replace(/[?&]$/, "");

    return this.request.delete(url);
  }

}