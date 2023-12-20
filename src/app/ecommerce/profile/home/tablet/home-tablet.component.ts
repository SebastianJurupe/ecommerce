import { Component, Injector, OnInit } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';

interface Resource {
  badge: string;
  name: string;
  format: string;
  method: () => void;
}
@Component({
  templateUrl: 'home-tablet.component.html',
  styleUrls: ['home-tablet.component.scss'],
  host: { 'app.profile.home-tablet': 'true' }
})
export class HomeTabletComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _toolbar: AppTabService;

  placeholders: any;
  selectedLanguage: 'en_US' | 'es_ES';
  resources: Resource[] = [];
  platform: string = '';

  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };

  iconSocial = [
    {
      classIcon: 'icon icon--instagram-white icon--20',
      method: () => window.open('https://www.instagram.com/renac_peru/')
    },
    {
      classIcon: 'icon icon--facebook-white icon--20',
      method: () => window.open('https://www.facebook.com/renacperu')
    },
    {
      classIcon: 'icon icon--youtube-white icon--20',
      method: () => window.open()
    },
    {
      classIcon: 'icon icon--twitter-white icon--20',
      method: () => window.open()
    },
    {
      classIcon: 'icon icon--linkedin-white icon--20',
      method: () => window.open()
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this.selectedLanguage = this.localization.currentLanguage;
    this._toolbar = _injector.get(AppTabService);
    this._toolbar = _injector.get(AppTabService);
    this.setPlaceholders();
  }

  ngOnInit() {
    this.updateResources();;
    this._toolbar.show();
  }

  ionViewWillEnter() {
    this._toolbar.show();
  }

  updateResources() {
    this.resources = [
      {
        badge: '99',
        name: this.localization.localize('profile.home.orders', 'ecommerce'),
        format: 'icon icon--box',
        method: () => this.navigation.forward('/app/ecommerce/profile/orders')
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.coupons', 'ecommerce'),
        format: 'icon icon--ticket',
        method: () => this.navigation.forward('/app/ecommerce/profile/coupons')
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.favourite', 'ecommerce'),
        format: 'icon icon--heart-outline',
        method: () => this.navigation.forward('/app/ecommerce/profile/favorites')
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.direction', 'ecommerce'),
        format: 'icon icon--location',
        method: () => this.navigation.forward('/app/ecommerce/profile/address-list')
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.cards', 'ecommerce'),
        format: 'icon icon--credit-card',
        method: () => this.navigation.forward('/app/ecommerce/profile/cards')
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.billingInformation', 'ecommerce'),
        format: 'icon icon--company',
        method: () => this.navigation.forward('/app/ecommerce/profile/invoicing-list')
      },
      {
        badge: '',
        name: 'Configuracion',
        format: 'icon icon--setting',
        method: () => this.navigation.forward('/app/ecommerce/profile/home')
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.help', 'ecommerce'),
        format: 'icon icon--help',
        method: () => this.navigation.forward('/app/ecommerce/profile/help')
      },
    ];
  }

  setLanguage(option: 'en_US' | 'es_ES') {
    this.selectedLanguage = option;
    this.localization.changeLanguage(option);
    this.setPlaceholders();
  }

  settingProfile() {
    this.navigation.forward('/app/ecommerce/profile/setting');
  }


  setPlaceholders() {
    this.updateResources();
    this.placeholders = {
      spanish: this.localization.localize('profile.login.spanish', 'ecommerce'),
      english: this.localization.localize('profile.login.english', 'ecommerce'),
    };
  }

  brandButtonEventCliked() {
    this.navigation.back('/app/ecommerce/home/home');
  }

  inboxClick() {
    // this.navigation.back('/app/ecommerce/inbox');
  }
}
