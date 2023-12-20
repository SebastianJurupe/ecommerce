import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'security-code.component.html',
  styleUrls: ['security-code.component.scss'],
  host: { 'app.security-code': 'true' }
})
export class SecurityCodeComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}