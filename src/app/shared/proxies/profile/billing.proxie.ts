import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from "rxjs";

@Injectable()
export class BillingServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  register(business_name: string, tax_identifier: string, fiscal_address: string, is_default: boolean, department_id: string, province_id: string, district_id: string): Observable<BillingAddressRegisterOutputDto> {
    const url = `${this.path}/api/services/app/BillingAddress/Register`;

    const body: string = JSON.stringify({
      business_name: business_name,
      tax_identifier: tax_identifier,
      fiscal_address: fiscal_address,
      default: is_default,
      department_id: department_id,
      province_id: province_id,
      district_id: district_id
    });

    return this.request.post(url, body);
  }

  update(id: number, business_name: string, tax_identifier: string, fiscal_address: string, is_default: boolean, department_id: string, province_id: string, district_id: string): Observable<void> {
    const url = `${this.path}/api/services/app/BillingAddress/Update`;

    const body = JSON.stringify({
      id: id,
      business_name: business_name,
      tax_identifier: tax_identifier,
      fiscal_address: fiscal_address,
      default: is_default,
      department_id: department_id,
      province_id: province_id,
      district_id: district_id
    });

    return this.request.put(url, body);
  }

  getAll(): Observable<BillingAddressGetAllOutputDto> {
    const url = `${this.path}/api/services/app/BillingAddress/GetAll`;

    return this.request.get(url);
  }

  delete(id: number): Observable<void> {
    let url = `${this.path}/api/services/app/BillingAddress/Delete`;

    if (id !== undefined && id !== null) {
      url += '?id=' + encodeURIComponent('' + id);
    }

    url.replace(/[?&]$/, '');

    return this.request.delete(url);
  }

}

export class BillingAddressRegisterOutputDto implements IFromJsonConvertable<BillingAddressRegisterOutputDto>{

  data!: BillingAddressRegisterOutputDataDto;
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

  fromJS(data: any): BillingAddressRegisterOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }

}

export class BillingAddressRegisterOutputDataDto {
  id: number = 0;
  business_name: string = '';
  tax_identifier: string = '';
  fiscal_address: string = '';
  default: boolean = false;
  department_id: string = '';
  province_id: string = '';
  district_id: string = '';
}

export class BillingAddressGetAllOutputDto implements IFromJsonConvertable<BillingAddressGetAllOutputDto>{

  data!: BillingAddressResponseDataDto[];
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

  fromJS(data: any): BillingAddressGetAllOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }

}
export class BillingAddressResponseDataDto {
  id: number = 0;
  business_name: string = '';
  tax_identifier: string = '';
  fiscal_address: string = '';
  default: boolean = false;
  department = {
    id: '',
    description: ''
  };
  province = {
    id: '',
    description: ''
  };
  district = {
    id: '',
    description: ''
  };
}