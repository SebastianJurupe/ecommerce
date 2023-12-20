import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'delete-card.component.html',
  styleUrls: ['delete-card.component.scss'],
  host: { 'app.delete-card': 'true' }
})
export class DeleteCardComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  handleCancelEvent() {
    this.dialog.dismiss('cancel');
  }

  handleDeleteEvent() {
    this.dialog.dismiss('delete');
  }
}