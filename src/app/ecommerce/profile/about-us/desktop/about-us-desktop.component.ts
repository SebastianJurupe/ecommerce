import { Component, Injector } from '@angular/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { AboutUsBaseComponent } from '../base/about-us-base.component';

@Component({
  templateUrl: 'about-us-desktop.component.html',
  styleUrls: ['about-us-desktop.component.scss'],
  host: { 'app.about-us-desktop': 'true' }
})
export class AboutUsDesktopComponent extends AboutUsBaseComponent {

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  navigateToHome() {
    this.navigation.back('/app/ecommerce/home/home');
  }

  navigateToInbox() {
    this.navigation.back('/app/ecommerce/inbox');
  }
}
