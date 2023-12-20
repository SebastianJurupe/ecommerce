import { Injectable, Injector } from '@angular/core';
import { ApiException, AppMessageService } from '@geor360/core';
import { ProfileGetPersonalInformationOutputDataDto, ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { BehaviorSubject } from 'rxjs';

const personalInformation = {
  id: 0,
  name: '',
  email: '',
  phone: '',
  api_token: '',
  has_verified_email: false,
  has_verified_phone: false,
  has_vrified: false,
  orders: 0,
  avatar: '',
  extras: {
    lang: '',
    theme: '',
    facebook: '',
    country_id: ''
  },
  country: {
    id: '',
    description: '',
    code: ''
  }
};

@Injectable({
  providedIn: 'root'
})
export class PersonalInformationService {

  private _appMessageService: AppMessageService;
  private _profileServiceProxy: ProfileServiceProxy;

  personalInformation$: BehaviorSubject<ProfileGetPersonalInformationOutputDataDto> = new BehaviorSubject<ProfileGetPersonalInformationOutputDataDto>(personalInformation);

  constructor(_injector: Injector) {
    this._appMessageService = _injector.get(AppMessageService);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
  }

  setPersonalInformation(): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      this._profileServiceProxy.getPersonalInformation()
        .subscribe({
          next: (res) => {
            this.personalInformation$.next(res.data);
            resolve(true);
          },
          error: (err) => {
            reject(false);
            throw new Error(err);
          }
        });
    });
  }

  getPersonalInformation() {
    return this.personalInformation$;
  }

  updatePersonalInformation(personalInformation: ProfileGetPersonalInformationOutputDataDto, noAvatar?: boolean): Promise<boolean> {
    let { name, extras, avatar } = personalInformation;

    if (noAvatar) { avatar = ''; }
    extras.facebook = '';
    const country_id = personalInformation.country.id;

    return new Promise<boolean>((resolve, reject) => {
      this._profileServiceProxy.updatePersonalInformation(name, extras, country_id, avatar)
        .subscribe({
          next: async () => {
            await this.setPersonalInformation();
            resolve(true);
          },
          error: (error: ApiException) => {
            reject(false);
            this._appMessageService.exception(error);
          }
        });
    });


  }
}
