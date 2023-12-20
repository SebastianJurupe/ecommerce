import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface RegisterDto {
  name: string;
  email: string;
  country_id: string;
  phone: string;
  password: string;
  device: string;
}

export interface ResetPassword {
  email?: string;
  code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CodeConfirmationService {

  codeConfirmationData$: BehaviorSubject<RegisterDto> = new BehaviorSubject<RegisterDto>({ email: '', country_id: '', phone: '', password: '', device: '', name: '' });

  resetPasswordData$: BehaviorSubject<ResetPassword> = new BehaviorSubject<ResetPassword>({ email: '', code: '' });

  setCodeConfirmationData(data: RegisterDto) {
    this.codeConfirmationData$.next(data);
  }

  getCodeConfirmationData() {
    return this.codeConfirmationData$;
  }

  setResetPasswordData(data: ResetPassword) {
    this.resetPasswordData$.next(data);
  }

  getResetPasswordData() {
    return this.resetPasswordData$;
  }

}
