import { Component, Injector } from '@angular/core';
import { AboutUsBaseComponent } from '../base/about-us-base.component';

@Component({
  templateUrl: 'about-us-mobile.component.html',
  styleUrls: ['about-us-mobile.component.scss'],
  host: { 'app.about-us-mobile': 'true' }
})
export class AboutUsMobileComponent extends AboutUsBaseComponent  {

  constructor(_injector: Injector) {
    super(_injector);
  }
}
