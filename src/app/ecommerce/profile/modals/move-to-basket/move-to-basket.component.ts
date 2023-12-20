import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'move-to-basket.component.html',
  styleUrls: ['move-to-basket.component.scss'],
  host: { 'app.move-to-basket': 'true' }
})
export class MoveToBasketComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  handleCancelEvent() {
    this.dialog.dismiss('cancel');
  }

  handleMoveEvent() {
    this.dialog.dismiss('move');
  }
}