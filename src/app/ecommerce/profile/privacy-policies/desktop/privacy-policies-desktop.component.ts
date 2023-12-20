import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ApiException, ViewComponent } from '@geor360/core';
import { PublicServiceProxy } from '@shared/proxies/public/public.proxie';
import { Subscription } from 'rxjs';
import { LegalInformationResponse } from '../../services/interfaces/legal-information-response.interface';
import { ActivatedRoute } from '@angular/router';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';

@Component({
  templateUrl: 'privacy-policies-desktop.component.html',
  styleUrls: ['privacy-policies-desktop.component.scss'],
  host: { 'app.privacy-policies-desktop': 'true' }
})
export class PrivacyPoliciesDesktopComponent extends ViewComponent implements OnInit, OnDestroy {

  private _publicServiceProxy: PublicServiceProxy;
  private _activatedRoute: ActivatedRoute;
  headerDesktopService: HeaderDesktopService;

  privacyPolicies: LegalInformationResponse = {
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
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  ngOnInit() {
    this.susbscribeToPrivacyPolicies();
  }

  susbscribeToPrivacyPolicies() {
    this.subscription = this._publicServiceProxy.getLegalInformation("privacy_policy")
      .subscribe({
        next: (response) => {
          if (response.data !== null) {
            this.privacyPolicies = response.data;
          } else {
            this.privacyPolicies.content = ''
          }
        },
        error: (error: ApiException) =>
          this.message.exception(error)
      });
  }

  onBackButtonPressed() {
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

  brandButtonEventCliked() {
    this.navigation.back('/app/ecommerce/home/home');
  }

}
