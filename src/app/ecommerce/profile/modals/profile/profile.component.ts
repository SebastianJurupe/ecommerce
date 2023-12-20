import { Component, Injector, OnInit } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter } from '@ionic/angular';
import { OrdersService } from '../../orders/orders.service';


interface Resource {
  badge: string;
  name: string;
  format: string;
  method: () => void;
}
@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.scss'],
  host: { 'app.profile': 'true' }
})
export class ProfileComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _ordersService: OrdersService;
  private _toolbar: AppTabService;
  private _popoverCtrl: PopoverController;

  placeholders: any;
  selectedLanguage: 'en_US' | 'es_ES';
  resources: Resource[] = [];
  platform: string = '';
  imageProfile: string = '';
  country = {
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
    this._ordersService = _injector.get(OrdersService);
    this._toolbar = _injector.get(AppTabService);
    this._popoverCtrl = _injector.get(PopoverController);
    this.setPlaceholders();
  }

  ngOnInit() {
    this.updateResources();;
    this._toolbar.show();
    if (this.session.user.profilePicture) {
      this.imageProfile = this.session.user.profilePicture;
    } else {
      this.imageProfile = '/assets/general/avatar.png';
    }

    this.getOrdersCounterValue();
  }

  getOrdersCounterValue() {
    this._ordersService.counter$
      .subscribe(counter => {
        this.resources[0].badge = counter.toString();
      });
  }

  ionViewWillEnter() {
    this._toolbar.show();
  }

  updateResources() {
    this.resources = [
      {
        badge: '',
        name: this.localization.localize('profile.home.orders', 'ecommerce'),
        format: 'icon icon--order-car icon--24',
        method: () => {
          this._popoverCtrl.dismiss();
          this.navigation.forwardNoAnimation('/app/ecommerce/profile/orders');
        }
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.coupons', 'ecommerce'),
        format: 'icon icon--ticket icon--24',
        method: () => {
          this._popoverCtrl.dismiss();
          this.navigation.forwardNoAnimation('/app/ecommerce/profile/coupons');
        }
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.favourite', 'ecommerce'),
        format: 'icon icon--heart-outline icon--24',
        method: () => {
          this._popoverCtrl.dismiss();
          this.navigation.forwardNoAnimation('/app/ecommerce/profile/favorites');
        }
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.direction', 'ecommerce'),
        format: 'icon icon--location icon--24',
        method: () => {
          this._popoverCtrl.dismiss();
          this.navigation.forwardNoAnimation('/app/ecommerce/profile/address-list');
        }
      },
      // {
      //   badge: '',
      //   name: this.localization.localize('profile.home.cards', 'ecommerce'),
      //   format: 'icon icon--credit-card icon--24',
      //   method: () => {
      //     this._popoverCtrl.dismiss();
      //     this.navigation.forwardNoAnimation('/app/ecommerce/profile/cards')
      //   }
      // },
      {
        badge: '',
        name: this.localization.localize('profile.home.billingInformation', 'ecommerce'),
        format: 'icon icon--company icon--24',
        method: () => {
          this._popoverCtrl.dismiss();
          this.navigation.forwardNoAnimation('/app/ecommerce/profile/invoicing-list');
        }
      },
      {
        badge: '',
        name: 'Configuracion',
        format: 'icon icon--setting icon--24',
        method: () => {
          this._popoverCtrl.dismiss();
          this.navigation.forwardNoAnimation('/app/ecommerce/profile/setting');
        }
      },
      {
        badge: '',
        name: this.localization.localize('profile.home.help', 'ecommerce'),
        format: 'icon icon--help icon--24',
        method: () => {
          this._popoverCtrl.dismiss();
          this.navigation.forwardNoAnimation('/app/ecommerce/profile/help');
        }
      },
    ];
  }





  settingProfile() {
    this.navigation.forwardNoAnimation('/app/ecommerce/profile/setting');
  }


  setPlaceholders() {
    this.updateResources();
    this.placeholders = {
      spanish: this.localization.localize('profile.login.spanish', 'ecommerce'),
      english: this.localization.localize('profile.login.english', 'ecommerce'),
    };
  }


}
