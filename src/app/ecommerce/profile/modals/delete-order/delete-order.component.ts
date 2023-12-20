import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  selector: 'app-delete-order',
  templateUrl: 'delete-order.component.html',
  styleUrls: ['delete-order.component.scss'],
  host: { 'app.delete-order': 'true' }
})
export class DeleteOrderComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

}
