import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'language-base.component.html',
  styleUrls: ['language-base.component.scss'],
  host: { 'app.language-base': 'true' }
})
export class LanguageBaseComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}
