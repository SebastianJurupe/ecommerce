import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'name-base.component.html',
  styleUrls: ['name-base.component.scss'],
  host: { 'app.name-base': 'true' }
})
export class NameBaseComponent extends ViewComponent {

  @Input() name: string = '';

  constructor(_injector: Injector) {
    super(_injector);
  }

  disableButton() {
    return this.name === '';
  }

  submit(name: string) {
    this.dialog.dismiss(name);
  }
}