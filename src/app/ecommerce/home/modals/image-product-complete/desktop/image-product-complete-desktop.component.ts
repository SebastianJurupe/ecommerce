import { Component } from '@angular/core';
import { ImageProductCompleteBaseComponent } from '../base/image-product-complete-base.component';

@Component({
  templateUrl: 'image-product-complete-desktop.component.html',
  styleUrls: ['image-product-complete-desktop.component.scss'],
  host: { 'app.image-product-complete-desktop': 'true' }
})
export class ImageProductCompleteDesktopComponent extends ImageProductCompleteBaseComponent {


}
