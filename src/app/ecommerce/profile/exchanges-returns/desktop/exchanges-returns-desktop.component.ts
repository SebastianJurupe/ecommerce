import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PublicServiceProxy } from '@shared/proxies/public/public.proxie';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';

@Component({
  templateUrl: 'exchanges-returns-desktop.component.html',
  styleUrls: ['exchanges-returns-desktop.component.scss'],
  host: { 'app.exchanges-returns-desktop': 'true' }
})
export class ExchangesReturnsDesktopComponent extends ViewComponent {

  private _publicServiceProxy: PublicServiceProxy;

  headerDesktopService: HeaderDesktopService;
  exChangesReturns = {
    id: 0,
    code: '',
    description: '',
    visible: 0,
    content: '',
    sort: 0,
    created_at: '',
    updated_at: ''
  };
  subscription: Subscription = new Subscription();

  constructor(_injector: Injector, private navCtrl: NavController) {
    super(_injector);
    this._publicServiceProxy = _injector.get(PublicServiceProxy);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  ngOnInit() {
    this.subscribeToExchangesReturns();
  }

  subscribeToExchangesReturns() {
    this.subscription = this._publicServiceProxy.getLegalInformation('exchanges_returns')
      .subscribe({
        next: (response) => {
          if (response.data !== null) {
            this.exChangesReturns = response.data;
          } else {
            this.exChangesReturns.content = ''
          }
        },
        error: (error) => console.error(error),
      });
  }

  navigateToHome() {
    this.navigation.back('/app/ecommerce/home/home');
  }

  navigateToInbox() {
    this.navigation.back('/app/ecommerce/inbox');
  }

  onBackButtonPressed() {
    this.navCtrl.back();
  }
}
