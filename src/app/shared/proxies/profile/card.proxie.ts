import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService } from "@geor360/core";

@Injectable()
export class CardServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  register(number: string, titular: string, expiration_date: string) {
    const url = `${this.path}/api/services/app/Card/Register`;

    const body = JSON.stringify({
      number: number,
      titular: titular,
      expiration_date: expiration_date,
    });

    return this.request.post(url, body);
  }

  udpate(id: number, number: string, titular: string, expiration_date: string) {
    const url = `${this.path}/api/services/app/Card/Update`;

    const body = JSON.stringify({
      id: id,
      number: number,
      titular: titular,
      expiration_date: expiration_date,
    });

    return this.request.put(url, body);
  }

  delete(id: number) {
    let url = `${this.path}/api/services/app/Card/Delete`;

    if (id !== null && id !== undefined) {
      url += `?id=${encodeURIComponent('' + id)}`;
    }

    url.replace(/[?&]$/, '');

    return this.request.delete(url);
  }

  getAll() {
    const url = `${this.path}/api/services/app/Card/GetAll`;

    return this.request.get(url);
  }
};