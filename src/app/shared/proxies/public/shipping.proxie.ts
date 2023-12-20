import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from 'rxjs';

export type ShippingType = 'DOMICILIO' | 'AGENCIA' | 'TIENDA';

@Injectable()
export class ShippingServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  getAllAvailables(): Observable<ShippingGetAllAvailablesOutputDto> {
    const url = `${this.path}/api/services/app/Shipping/GetAllAvailables`;

    return this.request.get(url);
  }

  getAllAgencies(): Observable<ShippingGetAllAgenciesOutputDto> {
    const url = `${this.path}/api/services/app/Shipping/GetAllAgencies`;

    return this.request.get(url);
  };

  getCalculateProduct(shippingType: ShippingType, productId: string, ubigeo?: string) {
    let url = `${this.path}/api/services/app/Shipping/GetCalculateProduct`;

    if (shippingType !== null && shippingType !== undefined) {
      url += `?shipping_type=${encodeURIComponent(shippingType)}`;
    }

    if (productId !== null && productId !== undefined) {
      url += `&product_id=${encodeURIComponent(productId)}`;
    }

    if (ubigeo !== null && ubigeo !== undefined) {
      url += `&ubigeo=${encodeURIComponent(ubigeo)}`;
    }

    return this.request.get(url);
  }

  getCalculate(type: ShippingType, agencyCode?: string, establishmentId?: number, ubigeo?: string) {
    let url = `${this.path}/api/services/app/Shipping/GetCalculate`;

    if (type !== null && type !== undefined) {
      url += `?type=${encodeURIComponent(type)}`;
    }

    if (agencyCode !== null && agencyCode !== undefined) {
      url += `&agency_code=${encodeURIComponent(agencyCode)}`;
    }

    if (establishmentId !== null && establishmentId !== undefined) {
      url += `&establishment_id=${encodeURIComponent(establishmentId)}`;
    }

    if (ubigeo !== null && ubigeo !== undefined) {
      url += `&ubigeo=${encodeURIComponent(ubigeo)}`;
    }

    return this.request.get(url);
  }
}

export class ShippingGetAllAvailablesOutputDto implements IFromJsonConvertable<ShippingGetAllAvailablesOutputDto>{

  success: boolean = false;
  data: ShippingGetAllAvailablesOutputDataDto[] = [];

  constructor(data?: any) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.success = data["success"];
      this.data = data["data"];
    }
  }

  fromJS(data: any): ShippingGetAllAvailablesOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class ShippingGetAllAvailablesOutputDataDto implements IFromJsonConvertable<ShippingGetAllAvailablesOutputDataDto> {

  code: string = '';
  description: string = '';

  constructor(data?: any) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.code = data["code"];
      this.description = data["description"];
    }
  }

  fromJS(data: any): ShippingGetAllAvailablesOutputDataDto {
    data = typeof data === "object" ? data : {};
    this.init(data);
    return this;
  }

}


export class ShippingGetAllAgenciesOutputDto implements IFromJsonConvertable<ShippingGetAllAgenciesOutputDto> {

  success: boolean = false;
  data: ShippingGetALlAgenciesOutputDataDto[] = [];

  constructor(data?: any) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.success = data["success"];
      this.data = data["data"];
    }
  }

  fromJS(data: any): ShippingGetAllAgenciesOutputDto {
    data = typeof data === "object" ? data : {};
    this.init(data);
    return this;
  }
}

export class ShippingGetALlAgenciesOutputDataDto implements IFromJsonConvertable<ShippingGetALlAgenciesOutputDataDto> {

  id: number = 0;
  name: string = '';
  logo: string = '';
  code: string = '';

  constructor(data?: any) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.id = data["id"];
      this.name = data["name"];
      this.logo = data["logo"];
      this.code = data["code"];
    }
  }

  fromJS(data: any): ShippingGetALlAgenciesOutputDataDto {
    data = typeof data === "object" ? data : {};
    this.init(data);
    return this;
  }
}