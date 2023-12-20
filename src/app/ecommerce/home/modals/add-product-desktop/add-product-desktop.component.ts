import { Component } from '@angular/core';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-add-product-desktop',
  templateUrl: './add-product-desktop.component.html',
  styleUrls: ['./add-product-desktop.component.scss'],
})
export class AddProductDesktopComponent extends AddProductComponent {

  ngOnInit() { }

  handleOptionsDesktop(option: 'viewBasket' | 'keepBuying') {
    if (option == 'keepBuying') {
      this.navigation.forwardNoAnimation('/app/ecommerce/home');
    }
    if (option == 'viewBasket') {
      this.navigation.forwardNoAnimation('/app/ecommerce/basket/home')
    }
    this.dialog.dismiss(option);
  }

}
