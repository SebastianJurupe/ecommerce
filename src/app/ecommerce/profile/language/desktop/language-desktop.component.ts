import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'language-desktop.component.html',
  styleUrls: ['language-desktop.component.scss'],
  host: { 'app.language-desktop': 'true' }
})
export class LanguageDesktopComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

}
