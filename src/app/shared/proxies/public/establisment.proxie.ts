import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService } from "@geor360/core";

@Injectable()
export class EstablismentServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  getAll() {
    const url = `${this.path}/api/services/app/Establishment/GetAll`;

    return this.request.get(url);
  }
}