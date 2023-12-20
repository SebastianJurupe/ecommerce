import { Component } from '@angular/core';
import { HomeBaseComponent } from '../base/home-base.component';

@Component({
  templateUrl: 'home-mobile.component.html',
  styleUrls: ['home-mobile.component.scss'],
  host: { 'app.profile.home-mobile': 'true' }
})
export class HomeMobileComponent extends HomeBaseComponent { }