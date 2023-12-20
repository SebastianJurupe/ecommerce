import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'language-tablet.component.html',
  styleUrls: ['language-tablet.component.scss'],
  host: { 'app.language-tablet': 'true' }
})
export class LanguageTabletComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }
}
