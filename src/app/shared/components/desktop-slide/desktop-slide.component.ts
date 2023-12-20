import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { OrdersService } from 'src/app/ecommerce/profile/orders/orders.service';

interface Resource {
  id: string;
  badge: string;
  name: string;
  format: string;
  method: () => void;
}
@Component({
  selector: 'app-desktop-slide',
  templateUrl: 'desktop-slide.component.html',
  styleUrls: ['desktop-slide.component.scss'],
})
export class DesktopSlideComponent extends ViewComponent implements OnInit {

  private _toolbar: AppTabService;
  private _ordersService: OrdersService;

  @Input() disabled: boolean = false;

  headerDesktopService: HeaderDesktopService;
  placeholders: any;
  platform: string = '';
  resources: Resource[] = [];
  selectedResource: string = '1';

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
    this._ordersService = _injector.get(OrdersService);
    this._toolbar = _injector.get(AppTabService);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
    this.setTextSlide();

  }

  ngOnInit() {
    this.setSelectedResource();
    this._toolbar.show();
    this.headerDesktopService.functionLanguage$.subscribe(() => {
      this.setTextSlide();
    });
    this.getOrdersCounterValue();
  }

  getOrdersCounterValue() {
    this._ordersService.counter$
      .subscribe(counter => {
        this.resources[0].badge = counter.toString();
      });
  }

  updateResources() {
    this.resources = [
      {
        id: 'orders',
        badge: '',
        name: this.placeholders.orders,
        format: 'icon icon--order-car',
        method: () => {
          if (!this.disabled)
            this.navigation.backNoAnimation('/app/ecommerce/profile/orders');
        }
      },
      {
        id: 'coupons',
        badge: '',
        name: this.placeholders.coupons,
        format: 'icon icon--ticket',
        method: () => {
          if (!this.disabled)
            this.navigation.backNoAnimation('/app/ecommerce/profile/coupons');
        }
      },
      {
        id: 'favorites',
        badge: '',
        name: this.placeholders.favorites,
        format: 'icon icon--heart-outline',
        method: () => {
          if (!this.disabled)
            this.navigation.backNoAnimation('/app/ecommerce/profile/favorites');
        }
      },
      {
        id: 'address-list',
        badge: '',
        name: this.placeholders.addresslist,
        format: 'icon icon--location',
        method: () => {
          if (!this.disabled)
            this.navigation.forwardNoAnimation('/app/ecommerce/profile/address-list');
        }
      },
      // {
      //   id: 'cards',
      //   badge: '',
      //   name: this.placeholders.cards,
      //   format: 'icon icon--credit-card',
      //   method: () => this.navigation.backNoAnimation('/app/ecommerce/profile/cards')
      // },
      {
        id: 'invoicing-list',
        badge: '',
        name: this.placeholders.invoicinglist,
        format: 'icon icon--company',
        method: () => {
          if (!this.disabled)
            this.navigation.backNoAnimation('/app/ecommerce/profile/invoicing-list');
        }
      },
      {
        id: 'setting',
        badge: '',
        name: this.placeholders.setting,
        format: 'icon icon--setting',
        method: () => {
          if (!this.disabled)
            this.navigation.backNoAnimation('/app/ecommerce/profile/setting');
        }
      },
      {
        id: 'help',
        badge: '',
        name: this.placeholders.help,
        format: 'icon icon--help',
        method: () => {
          if (!this.disabled)
            this.navigation.backNoAnimation('/app/ecommerce/profile/help');
        }
      },
    ];
  }

  setSelectedResource() {
    let path = window.location.pathname.split('/')[4];
    path === 'book-of-claims' && (path = 'help');
    this.selectedResource = path;
  }


  setTextSlide() {
    this.placeholders = {
      orders: this.localization.localize('profile.home.orders', 'ecommerce'),
      coupons: this.localization.localize('profile.home.coupons', 'ecommerce'),
      favorites: this.localization.localize('profile.home.favourite', 'ecommerce'),
      addresslist: this.localization.localize('profile.home.direction', 'ecommerce'),
      cards: this.localization.localize('profile.home.cards', 'ecommerce'),
      invoicinglist: this.localization.localize('profile.home.billingInformation', 'ecommerce'),
      setting: this.localization.localize('profile.setting.title', 'ecommerce'),
      help: this.localization.localize('profile.home.help', 'ecommerce'),
    };
    this.updateResources();
  }

}
