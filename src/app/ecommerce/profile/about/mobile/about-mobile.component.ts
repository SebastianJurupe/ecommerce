import { Component } from '@angular/core';
import { AboutBaseComponent } from '../base/about-base.component';

@Component({
  templateUrl: 'about-mobile.component.html',
  styleUrls: ['about-mobile.component.scss'],
  host: { 'app.about-mobile': 'true' }
})
export class AboutMobileComponent extends AboutBaseComponent {}
