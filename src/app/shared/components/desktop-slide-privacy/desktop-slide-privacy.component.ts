import { Component, Injector, OnInit } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';

interface Resource {
  id: string,
  name: string;
  method: () => void;
}
@Component({
  selector: 'app-desktop-slide-privacy',
  templateUrl: 'desktop-slide-privacy.component.html',
  styleUrls: ['desktop-slide-privacy.component.scss'],
})
export class DesktopSlidePrivacyComponent extends ViewComponent implements OnInit {

  private _toolbar: AppTabService;

  headerDesktopService: HeaderDesktopService;
  resources: Resource[] = [];
  platform: string = '';
  selectedResource: string = '1';



  constructor(_injector: Injector) {
    super(_injector);
    this._toolbar = _injector.get(AppTabService);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
    this.setPlaceholders();
  }

  ngOnInit() {
    this.setSelectedResource();
    this.updateResources();;
    this._toolbar.show();
  }


  updateResources() {
    this.resources = [
      {
        id: 'about-us',
        name: this.localization.localize("profile.about.about", "ecommerce"),
        method: () => this.navigation.forwardNoAnimation('/app/ecommerce/profile/about-us')
      },
      {
        id: 'terms-conditions',
        name: this.localization.localize("profile.about.terms", "ecommerce"),
        method: () => this.navigation.forwardNoAnimation('/app/ecommerce/profile/terms-conditions')
      },
      {
        id: 'privacy-policies',
        name: this.localization.localize("profile.about.privacy", "ecommerce"),
        method: () => this.navigation.forwardNoAnimation('/app/ecommerce/profile/privacy-policies')
      },
      {
        id: 'exchanges-returns',
        name: this.localization.localize("profile.about.exchanges", "ecommerce"),
        method: () => this.navigation.forwardNoAnimation('/app/ecommerce/profile/exchanges-returns')
      },
      // {
      //   id: 'terms-and-conditions-of-shipment',
      //   name: 'Terminos y condiciones de envío',
      //   method: () => this.navigation.forwardNoAnimation('/app/ecommerce/home/terms-and-conditions-of-shipment')
      // },
    ];
  }

  setPlaceholders() {
    this.updateResources();
  }

  setSelectedResource() {
    let path = window.location.pathname.split('/')[4];
    this.selectedResource = path;
  }
}
