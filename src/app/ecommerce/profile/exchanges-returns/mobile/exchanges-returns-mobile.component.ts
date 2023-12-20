import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { NavController } from '@ionic/angular';
import { PublicServiceProxy } from '@shared/proxies/public/public.proxie';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'exchanges-returns-mobile.component.html',
  styleUrls: ['exchanges-returns-mobile.component.scss'],
  host: { 'app.exchanges-returns-mobile': 'true' }
})
export class ExchangesReturnsMobileComponent extends ViewComponent implements OnInit {

  private _publicServiceProxy: PublicServiceProxy;
  private _navController: NavController;

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

  constructor(_injector: Injector) {
    super(_injector);
    this._publicServiceProxy = _injector.get(PublicServiceProxy);
    this._navController = _injector.get(NavController);
  }

  ngOnInit() {
    this.subscribeToExchangesReturns();
  }

  subscribeToExchangesReturns() {
    this.subscription = this._publicServiceProxy.getLegalInformation('exchanges_returns')
      .subscribe({
        next: (response) => {
          this.exChangesReturns = response.data;
        },
        error: (error) => console.error(error),
      });
  }

  onBackButtonPressed() {
    this._navController.back();
  }
}
