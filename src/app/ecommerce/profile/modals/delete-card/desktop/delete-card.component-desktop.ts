import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'delete-card-desktop.component.html',
  styleUrls: ['delete-card-desktop.component.scss'],
  host: { 'app.delete-card-desktop': 'true' }
})
export class DeleteCardDesktopComponent extends ViewComponent {

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