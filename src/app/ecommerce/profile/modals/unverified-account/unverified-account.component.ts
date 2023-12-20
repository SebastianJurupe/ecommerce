import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'unverified-account.component.html',
  styleUrls: ['unverified-account.component.scss']
})
export class UnverifiedAccountComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}
