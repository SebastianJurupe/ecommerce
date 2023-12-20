import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  registerEcommerce(name: string, email: string, country_id: string, phone: string, password: string, device: string): Observable<AuthResultModel> {
    const url = `${this.path}/api/TenantAuthentication/RegisterWithPhoneNumberAndEmail`;
    const body: string = JSON.stringify({
      // id_company: environment.id_company,
      name,
      email,
      country_id,
      phone,
      password,
      device,
    });

    return this.request.post(url, body);
  }

  authEcommerce(username: string, country_id: string, password: string, device: string) {
    const url = `${this.path}/api/TenantAuthentication/AuthWithPhoneNumberAndEmail`;
    const body: string = JSON.stringify({
      // id_company: environment.id_company,
      username,
      country_id,
      password,
      device,
    });

    return this.request.post(url, body);
  }

  logOut(): Observable<void> {
    const url = `${this.path}/api/TenantAuthentication/LogOut`;
    return this.request.get(url);
  }

}

class AuthResultModel implements IFromJsonConvertable<AuthResultModel>{
  accessToken: string = '';
  accessTokenExpireInSeconds: number = 0;
  encryptedAccessToken: string = '';
  refreshToken: string = '';
  refreshTokenExpireInSeconds: number = 0;
  accesTokenBasic: string = '';
  accesTokenExpire: string = '';
  accesTokenECommerce: string = '';

  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = data[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.accessToken = data['accessToken'];
      this.accessTokenExpireInSeconds = data['accessTokenExpireInSeconds'];
      this.encryptedAccessToken = data['encryptedAccessToken'];
      this.refreshToken = data['refreshToken'];
      this.refreshTokenExpireInSeconds = data['refreshTokenExpireInSeconds'];
      this.accesTokenBasic = data['accesTokenBasic'];
      this.accesTokenExpire = data['accesTokenExpire'];
      this.accesTokenECommerce = data['accesTokenECommerce'];
    }
  }

  fromJS(data: any): AuthResultModel {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return data;
  }
}