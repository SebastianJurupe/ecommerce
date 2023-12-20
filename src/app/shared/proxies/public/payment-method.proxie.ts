import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from 'rxjs';

@Injectable()
export class PaymentMethodServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  getAvailables(): Observable<PaymentMethodGetAvailablesOutputDto> {
    const url = `${this.path}/api/services/app/PaymentMethod/GetAvailables`;

    return this.request.get(url);
  }

}

export class PaymentMethodGetAvailablesOutputDto implements IFromJsonConvertable<PaymentMethodGetAvailablesOutputDto>{

  success: boolean = false;
  message: string = '';
  data: PaymentMethodGetAvailablesOutputDataDto[] = [];

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
      this.success = data["success"];
      this.message = data["message"];
      this.data = data["data"];
    }
  }

  fromJS(data: any): PaymentMethodGetAvailablesOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class PaymentMethodGetAvailablesOutputDataDto implements IFromJsonConvertable<PaymentMethodGetAvailablesOutputDataDto>{

  code: string = '';
  name: string = '';
  commission: number = 0;
  accounts: PaymentMethodGetAvailablesOutputAccountsDto[] = [];

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
      this.code = data["code"];
      this.name = data["name"];
      this.commission = data["commission"];
      this.accounts = data["accounts"];
    }
  };

  fromJS(data: any): PaymentMethodGetAvailablesOutputDataDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class PaymentMethodGetAvailablesOutputAccountsDto implements IFromJsonConvertable<PaymentMethodGetAvailablesOutputAccountsDto>{

  description: string = '';
  number: number = 0;
  cci: number = 0;
  owner: string = '';
  bank: PaymentMethodGetAvailablesOutputBankDto = new PaymentMethodGetAvailablesOutputBankDto();
  currency: PaymentMethodGetAvailablesOutputCurrencyDto = new PaymentMethodGetAvailablesOutputCurrencyDto();

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
      this.description = data["description"];
      this.number = data["number"];
      this.cci = data["cci"];
      this.owner = data["owner"];
      this.bank = data["bank"];
      this.currency = data["currency"];
    }
  }

  fromJS(data: any): PaymentMethodGetAvailablesOutputAccountsDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class PaymentMethodGetAvailablesOutputBankDto implements IFromJsonConvertable<PaymentMethodGetAvailablesOutputBankDto>{

  description: string = '';
  logo: string = '';

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
      this.description = data["description"];
      this.logo = data["logo"];
    }
  }

  fromJS(data: any): PaymentMethodGetAvailablesOutputBankDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class PaymentMethodGetAvailablesOutputCurrencyDto implements IFromJsonConvertable<PaymentMethodGetAvailablesOutputCurrencyDto>{

  id: string = '';
  description: string = '';
  symbol: string = '';

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
      this.id = data["id"];
      this.description = data["description"];
      this.symbol = data["symbol"];
    }
  }

  fromJS(data: any): PaymentMethodGetAvailablesOutputCurrencyDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}