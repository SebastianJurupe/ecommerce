import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from "rxjs";

interface Extra {
  national_division: string,
  value: string,
  ubigeo: string;
}

@Injectable()
export class AddressServiceProxy {

  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  register(description: string, country_id: string, address: string, extra: Extra[], postal_code: string, is_default: boolean): Observable<AddressRegisterOutputDto> {
    const url = `${this.path}/api/services/app/Address/Register`;

    const body: string = JSON.stringify({
      description: description,
      country_id: country_id,
      address: address,
      extra: extra,
      postal_code: postal_code,
      default: is_default
    });

    return this.request.post(url, body);
  }

  delete(id: number) {
    let url = `${this.path}/api/services/app/Address/Delete`;

    if (id !== undefined && id !== null) {
      url += '?id=' + encodeURIComponent('' + id);
    }

    url.replace(/[?&]$/, '');

    return this.request.delete(url);
  }

  update(id: number, description: string, country_id: string, address: string, extra: Extra[], postal_code: string, is_default: boolean) {
    const url = `${this.path}/api/services/app/Address/Update`;

    const body: string = JSON.stringify({
      id: id,
      description: description,
      country_id: country_id,
      address: address,
      extra: extra,
      postal_code: postal_code,
      default: is_default
    });

    return this.request.put(url, body);
  }

  getAll(): Observable<AddressListDataResponseDto> {
    const url = `${this.path}/api/services/app/Address/GetAll`;

    return this.request.getWithCompany(url, 3);
  }

}

export class AddressRegisterOutputDto implements IFromJsonConvertable<AddressRegisterOutputDto>{

  data: any;
  success: boolean = false;
  message: string = '';

  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.data = data['data'];
      this.success = data['success'];
      this.message = data['message'];
    }
  }

  fromJS(data: any): AddressRegisterOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class AddressListDataResponseDto implements IFromJsonConvertable<AddressListDataResponseDto>{
  data: AddressListResponseOutputDto[] = [];
  success: boolean = false;
  message: string = '';

  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.data = data['data'];
      this.success = data['success'];
      this.message = data['message'];
    }
  }

  fromJS(data: any): AddressListDataResponseDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class AddressListResponseOutputDto {
  id: number = 0;
  description: string = '';
  country: string = '';
  extra: AddressExtraDataDto[] = [];
  postal_code: string = '';
  default: boolean = false;
  address: string = '';
}
export class AddressExtraDataDto {
  national_division: string = '';
  value: string = '';
  ubigeo: string = '';
}