import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from "rxjs";

@Injectable()
export class ProfileServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  updatePassword(current_password: string, password: string, password_confirmation: string) {
    const url = `${this.path}/api/services/app/Profile/UpdatePassword`;

    const body = JSON.stringify({
      current_password: current_password,
      password: password,
      password_confirmation: password_confirmation,
    });

    return this.request.put(url, body);
  }

  updatePhone(phone: string) {
    const url = `${this.path}/api/services/app/Profile/UpdatePhone`;

    const body = JSON.stringify({
      phone: phone,
    });

    return this.request.put(url, body);
  }

  validateCodeUpdatePhone(phone: string, code: string) {
    const url = `${this.path}/api/services/app/Profile/ValidateCodeUpdatePhone`;

    const body = JSON.stringify({
      phone: phone,
      code: code,
    });

    return this.request.post(url, body);
  }

  requireChangeEmail(email: string) {
    const url = `${this.path}/api/services/app/Profile/RequireChangeEmail`;

    const body = JSON.stringify({
      email: email,
    });

    return this.request.post(url, body);
  }

  validateCodeEmailChange(email: string, code: string) {
    const url = `${this.path}/api/services/app/Profile/ValidateCodeEmailChange`;

    const body = JSON.stringify({
      email: email,
      code: code,
    });

    return this.request.post(url, body);
  }

  registerClaim(full_name: string, document_type: string, document_number: string, email: string, phone: string, address: string, department: string, province: string, district: string, description: string): Observable<ProfileRegisterClaimOutputDto> {
    const url = `${this.path}/api/services/app/Profile/RegisterClaim`;

    const body: string = JSON.stringify({
      full_name: full_name,
      document_type: document_type,
      document_number: document_number,
      email: email,
      phone: phone,
      address: address,
      department: department,
      province: province,
      district: district,
      description: description,
    });

    return this.request.post(url, body);
  }

  getPersonalInformation(): Observable<ProfileGetPersonalInformationOutputDto> {
    const url = `${this.path}/api/services/app/Profile/GetPersonalInformation`;

    return this.request.get(url);
  }

  updatePersonalInformation(name: string, extras: { lang: string, theme: string, facebook: string; }, country_id: string, avatar: string) {
    const url = `${this.path}/api/services/app/Profile/UpdatePersonalInformation`;

    const body = JSON.stringify({
      name: name,
      extras: extras,
      country_id: country_id,
      avatar: avatar
    });

    return this.request.put(url, body);
  }
}

export class ProfileRegisterClaimOutputDto implements IFromJsonConvertable<ProfileRegisterClaimOutputDto>{
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
      this.success = data['success'];
      this.message = data['message'];
    }
  }

  fromJS(data: any): ProfileRegisterClaimOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class ProfileGetPersonalInformationOutputDto implements IFromJsonConvertable<ProfileGetPersonalInformationOutputDto> {
  succes: boolean = false;
  data: ProfileGetPersonalInformationOutputDataDto = new ProfileGetPersonalInformationOutputDataDto();
  created_at: string = '';

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
      this.succes = data['succes'];
      this.data = data['data'];
      this.created_at = data['created_at'];
    }
  }

  fromJS(data: any): ProfileGetPersonalInformationOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class ProfileGetPersonalInformationOutputDataDto {
  id: number = 0;
  name: string = '';
  email: string = '';
  phone: string = '';
  api_token: string = '';
  has_verified_email: boolean = false;
  has_verified_phone: boolean = false;
  orders: number = 0;
  has_vrified: boolean = false;
  avatar: string = '';
  extras: ProfileGetPersonalInformationOutputExtrasDto = { lang: '', theme: '', facebook: '', country_id: '' };
  country: ProfileGetPersonalInformationOutputCountryDto = { id: '', description: '', code: '' };
}

export class ProfileGetPersonalInformationOutputExtrasDto {
  lang: string = '';
  theme: string = '';
  facebook: string = '';
  country_id: string = '';
}

export class ProfileGetPersonalInformationOutputCountryDto {
  id: string = '';
  description: string = '';
  code: string = '';
}