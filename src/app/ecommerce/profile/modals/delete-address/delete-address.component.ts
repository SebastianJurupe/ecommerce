import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  selector: 'app-delete-address',
  templateUrl: 'delete-address.component.html',
  styleUrls: ['delete-address.component.scss'],
  host: { 'app.delete-address': 'true' }
})
export class DeleteAddressComponent extends ViewComponent {
  @Input() desktop: boolean = false
  constructor(_injector: Injector) {
    super(_injector);
  }

}
