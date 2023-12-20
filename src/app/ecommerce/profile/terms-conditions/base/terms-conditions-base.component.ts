import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PublicServiceProxy } from '@shared/proxies/public/public.proxie';
import { Subscription } from 'rxjs';
import { LegalInformationResponse } from '../../services/interfaces/legal-information-response.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'terms-conditions-base.component.html',
  styleUrls: ['terms-conditions-base.component.scss'],
  host: { 'app.terms-conditions-base': 'true' }
})
export class TermsConditionsBaseComponent extends ViewComponent implements OnInit, OnDestroy {

  private _publicServiceProxy: PublicServiceProxy;
  private _activatedRoute: ActivatedRoute;

  termsConditions: LegalInformationResponse = {
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
    this._activatedRoute = _injector.get(ActivatedRoute);
  }

  ngOnInit() {
    this.subscribeToTermsConditions();
  }

  subscribeToTermsConditions() {
    this.subscription = this._publicServiceProxy.getLegalInformation("terms_and_conditions")
      .subscribe({
        next: (response) => {
          if (response.data === null) {
          } else {
            this.termsConditions = response.data;
          }
        },
        error: (error) =>
          console.error(error)
      });
  }

  back() {
    const { path } = this._activatedRoute.snapshot.queryParams;
    if (path === 'register') {
      this.navigation.back(`/app/ecommerce/profile/${path}`);
    } else {
      this.navigation.back('/app/ecommerce/profile/about');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
