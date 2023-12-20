import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'add-product.component.html',
  styleUrls: ['add-product.component.scss'],
  host: { 'app.add-product': 'true' }
})
export class AddProductComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  handleOptions(option: 'viewBasket' | 'keepBuying') {
    this.dialog.dismiss(option);
  }
}
