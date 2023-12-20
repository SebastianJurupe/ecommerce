import { Component, Injector, OnInit } from '@angular/core';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { ProfileGetPersonalInformationOutputDataDto, ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { PersonalInformationService } from '../../services/personal-information.service';
import { InitialConfigComponent } from 'src/app/ecommerce/home/initial-config/initial-config.component';
import { PublicServiceProxy } from '@shared/proxies/public/public.proxie';
import { OrdersService } from '../../orders/orders.service';

type Language = 'en_US' | 'es_ES';
interface Resource {
  badge: string;
  name: string;
  format: string;
  method: () => void;
}

@Component({
  templateUrl: 'home-base.component.html',
  styleUrls: ['home-base.component.scss'],
  host: { 'app.profile.home-base': 'true' }
})
export class HomeBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _ordersService: OrdersService;
  private _personalInformationService: PersonalInformationService;
  private _profileServiceProxy: ProfileServiceProxy;
  private _publicServiceProxy: PublicServiceProxy;
  private _toolbar: AppTabService;

  defaultAvatar: string = '/assets/general/avatar.png';
  personalInformation: ProfileGetPersonalInformationOutputDataDto = new ProfileGetPersonalInformationOutputDataDto();
  placeholders: { [key: string]: string; } = {};
  platform: string = '';
  resources: Resource[] = [];
  selectedLanguage: 'en_US' | 'es_ES' = 'es_ES';
  country = {
    id: '',
    description: '',
    default: true,
    code: '',
    mask: '',
    flag: ''
  };
  socialOptions = [
    {
      classIcon: 'icon icon--instagram-white icon--20',
      method: () => window.open('https://www.instagram.com/renacperu/?igshid=M2RkZGJiMzhjOQ%3D%3D')
    },
    {
      classIcon: 'icon icon--facebook-white icon--20',
      method: () => window.open('https://www.facebook.com/renacperu?mibextid=ZbWKwL')
    },
    {
      classIcon: 'icon icon--tiktok icon--32',
      method: () => window.open('https://www.tiktok.com/@renacperu?_t=8hm4sPSO02g&_r=1')
    },
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this._ordersService = _injector.get(OrdersService);
    this._personalInformationService = _injector.get(PersonalInformationService);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
    this._publicServiceProxy = _injector.get(PublicServiceProxy);
    this._toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    this.subscribeToPersonalInformation();
    this._ordersService.setCounter();
  }

  ionViewWillEnter() {
    this._toolbar.show();
    this.refreshPlaceholders();
    this.getOrdersCounterValue();
  }

  getOrdersCounterValue() {
    this._ordersService.counter$
      .subscribe(counter => {
        this.resources[0].badge = counter.toString();
      });
  }

  subscribeToPersonalInformation() {
    this._personalInformationService.getPersonalInformation()
      .subscribe({
        next: async (res) => {
          if (res.id !== 0) {
            this.personalInformation = res;
            this.selectedLanguage = res.extras.lang as Language;
            this.localization.changeLanguage(this.selectedLanguage);
            this.refreshPlaceholders();
            this.getCountry(res.extras.country_id);
          } else {
            const loaded = await this._personalInformationService.setPersonalInformation();

            if (loaded) { this.subscribeToPersonalInformation(); }
          }
        },
        error: (err) => { throw new Error(err); }
      });
  }

  refreshPlaceholders() {
    this.resources = [
      {
        badge: '',
        name: this.localization.localize('profile.home.orders', 'ecommerce'),
        format: 'icon icon--box',
        method: () => {
          if (!this.userAccountIsValidate()) {
            this.navigation.forward('/app/ecommerce/profile/personal-information');
          } else {
            this.navigation.forward('/app/ecommerce/profile/orders');
          }
        }
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.coupons', 'ecommerce'),
        format: 'icon icon--ticket',
        method: () => {
          if (!this.userAccountIsValidate()) {
            this.navigation.forward('/app/ecommerce/profile/personal-information');
          } else {
            this.navigation.forward('/app/ecommerce/profile/coupons');
          }
        }
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.favourite', 'ecommerce'),
        format: 'icon icon--heart-outline',
        method: () => {
          if (!this.userAccountIsValidate()) {
            this.navigation.forward('/app/ecommerce/profile/personal-information');
          } else {
            this.navigation.forward('/app/ecommerce/profile/favorites');
          }
        }
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.direction', 'ecommerce'),
        format: 'icon icon--location',
        method: () => {
          if (!this.userAccountIsValidate()) {
            this.navigation.forward('/app/ecommerce/profile/personal-information');
          } else {
            this.navigation.forward('/app/ecommerce/profile/address-list');
          }
        }
      },
      // {
      //   badge: '',
      //   name: this.localization.localize('profile.home.cards', 'ecommerce'),
      //   format: 'icon icon--credit-card',
      //   method: () => this.navigation.forward('/app/ecommerce/profile/cards')
      // },
      {
        badge: '',
        name: this.localization.localize('profile.home.billingInformation', 'ecommerce'),
        format: 'icon icon--company',
        method: () => {
          if (!this.userAccountIsValidate()) {
            this.navigation.forward('/app/ecommerce/profile/personal-information');
          } else {
            this.navigation.forward('/app/ecommerce/profile/invoicing-list');
          }
        }
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.help', 'ecommerce'),
        format: 'icon icon--help',
        method: () => {
          if (!this.userAccountIsValidate()) {
            this.navigation.forward('/app/ecommerce/profile/personal-information');
          } else {
            this.navigation.forward('/app/ecommerce/profile/help');
          }
        }
      },
    ];

    this.placeholders = {
      spanish: this.localization.localize('profile.login.spanish', 'ecommerce'),
      english: this.localization.localize('profile.login.english', 'ecommerce'),
    };
  }

  settingProfile() {
    this.navigation.forward('/app/ecommerce/profile/setting');
  }

  userAccountIsValidate(): boolean {
    return this.personalInformation.has_verified_email && this.personalInformation.has_verified_phone;
  }

  countryLanguage() {
    this.dialog.showWithData<'cancel' | any>({
      component: InitialConfigComponent,
      componentProps: {
        usedAsModal: true,
        country: this.country,
        selectedLanguage: this.selectedLanguage
      },
      cssClass: ['modal-custom', 'modal-custom--full']
    }).then((res) => {
      this._toolbar.show();
      if (res.data.result !== 'cancel') {
        const { country, language } = res.data.result;

        this.country = country;
        this.selectedLanguage = language;
        this.updatePersonalInformation(country.id);
        this.refreshPlaceholders();
      }
    });
  }

  updatePersonalInformation(country_id: string) {
    let { name, extras, avatar, country: { id } } = this.personalInformation;
    avatar = '';
    extras.facebook = '';
    extras.lang = this.selectedLanguage;
    extras.country_id = country_id;

    this._profileServiceProxy.updatePersonalInformation(name, extras, id, avatar)
      .subscribe({
        next: async () => {
          await this._personalInformationService.setPersonalInformation();
        },
        error: (error: ApiException) => { this.message.exception(error); }
      });
  }

  getCountry(countryId: string) {
    this._publicServiceProxy.getCountries()
      .subscribe({
        next: (res) => {
          const countries = res.data;
          this.country = countries.find((country: any) => country.id === countryId);
        },
        error: (err) => { console.error(err); }
      });
  }
}
