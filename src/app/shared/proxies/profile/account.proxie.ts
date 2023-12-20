import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from "rxjs";

@Injectable()
export class AccountServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  sendVerificationCodePhone(): Observable<AccountSendVerificationCodePhoneOutputDto> {
    const url = `${this.path}/api/services/app/Account/SendVerificationCodePhone`;

    return this.request.post(url);
  }

  reSendVerificationCodePhone(): Observable<AccountReSendVerificationCodePhoneOutputDto> {
    const url = `${this.path}/api/services/app/Account/ReSendVerificationCodePhone`;

    return this.request.post(url);
  }

  sendVerificationCodeEmail(): Observable<AccountSendVerificationCodeEmailOutputDto> {
    const url = `${this.path}/api/services/app/Account/SendVerificationCodeEmail`;

    return this.request.post(url);
  }

  reSendVerificationCodeEmail(): Observable<AccountReSendVerificationCodeEmailOutputDto> {
    const url = `${this.path}/api/services/app/Account/ReSendVerificationCodeEmail`;

    return this.request.post(url);
  }

  resetPassword(email: string): Observable<AccountUpdatePasswordResetPasswordInputDto> {
    let url = `${this.path}/api/services/app/Account/ResetPassword`;

    const body: string = JSON.stringify({
      email: email
    });

    return this.request.post(url, body);
  }

  resetPasswordValidateCode(email: string, code: string) {
    const url = `${this.path}/api/services/app/Account/ResetPasswordValidateCode`;

    const body: string = JSON.stringify({
      email: email,
      code: code
    });

    return this.request.post(url, body);
  };

  resetPasswordResendCode(email: string) {
    const url = `${this.path}/api/services/app/Account/ResetPasswordReSendCode`;

    const body: string = JSON.stringify({
      email: email
    });

    return this.request.post(url, body);
  }

  updatePasswordResetPassword(email: string, code: string, password: string, password_confirmation: string): Observable<AccountUpdatePasswordResetPasswordOutputDto> {
    let url = `${this.path}/api/services/app/Account/UpdatePasswordResetPassword`;

    const body: string = JSON.stringify({
      email,
      code,
      password,
      password_confirmation,
    });

    return this.request.put(url, body);
  }

  validateVerificationCodePhone(code: string): Observable<AccountValidateVerificationCodePhoneOutputDto> {

    const url = `${this.path}/api/services/app/Account/ValidateVerificationCodePhone`;

    const body: string = JSON.stringify({
      code
    });

    return this.request.post(url, body);
  }

  validateVerificationCodeEmail(code: string): Observable<AccountValidateVerificationCodeEmailOutputDto> {

    const url = `${this.path}/api/services/app/Account/ValidateVerificationCodeEmail`;

    const body: string = JSON.stringify({
      code
    });

    return this.request.post(url, body);
  }

  getUbigeo() {
    const url = `${this.path}/api/services/app/Account/GetUbigeo`;

    return this.request.get(url);
  }
}


export class AccountSendVerificationCodePhoneOutputDto implements IFromJsonConvertable<AccountSendVerificationCodePhoneOutputDto>{
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

  fromJS(data: any): AccountSendVerificationCodePhoneOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}
export class AccountReSendVerificationCodePhoneOutputDto implements IFromJsonConvertable<AccountReSendVerificationCodePhoneOutputDto>{
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

  fromJS(data: any): AccountReSendVerificationCodePhoneOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}
export class AccountSendVerificationCodeEmailOutputDto implements IFromJsonConvertable<AccountSendVerificationCodeEmailOutputDto>{
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

  fromJS(data: any): AccountSendVerificationCodeEmailOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}
export class AccountReSendVerificationCodeEmailOutputDto implements IFromJsonConvertable<AccountReSendVerificationCodeEmailOutputDto>{
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

  fromJS(data: any): AccountReSendVerificationCodeEmailOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}
export class AccountUpdatePasswordResetPasswordInputDto implements IFromJsonConvertable<AccountUpdatePasswordResetPasswordInputDto>{
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

  fromJS(data: any): AccountUpdatePasswordResetPasswordInputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}
export class AccountUpdatePasswordResetPasswordOutputDto implements IFromJsonConvertable<AccountUpdatePasswordResetPasswordOutputDto>{
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

  fromJS(data: any): AccountUpdatePasswordResetPasswordOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}
export class AccountValidateVerificationCodePhoneOutputDto implements IFromJsonConvertable<AccountValidateVerificationCodePhoneOutputDto>{
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

  fromJS(data: any): AccountValidateVerificationCodePhoneOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}
export class AccountValidateVerificationCodeEmailOutputDto implements IFromJsonConvertable<AccountValidateVerificationCodeEmailOutputDto>{
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

  fromJS(data: any): AccountValidateVerificationCodeEmailOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}