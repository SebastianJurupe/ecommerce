import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'delete-product.component.html',
  styleUrls: ['delete-product.component.scss'],
})
export class DeleteProductComponent extends ViewComponent {

  @Input() desktop: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
  }

  deleteClick() {
    this.dialog.dismiss('delete');
  }

  cancelClick() {
    this.dialog.dismiss('cancel');
  }

}
