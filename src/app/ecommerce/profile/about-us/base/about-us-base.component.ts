import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PublicServiceProxy } from '@shared/proxies/public/public.proxie';
import { Subscription } from 'rxjs';
import { LegalInformationResponse } from '../../services/interfaces/legal-information-response.interface';

@Component({
  templateUrl: 'about-us-base.component.html',
  styleUrls: ['about-us-base.component.scss'],
  host: { 'app.about-us-base': 'true' }
})
export class AboutUsBaseComponent extends ViewComponent implements OnInit, OnDestroy {

  private _publicServiceProxy: PublicServiceProxy;

  about: LegalInformationResponse = {
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
  }

  ngOnInit() {
    this.onSubscribeToAbout();
  }

  onSubscribeToAbout() {
    this.subscription = this._publicServiceProxy.getLegalInformation("about_us")
      .subscribe({
        next: (response) => {
          if (response.data === null) {
          } else {
            this.about = response.data;
          }
        },
        error: (error) =>
          console.error(error)
      });
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/about');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
