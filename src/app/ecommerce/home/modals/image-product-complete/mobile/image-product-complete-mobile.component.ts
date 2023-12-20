import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { Platform } from '@ionic/angular';

@Component({
  templateUrl: 'image-product-complete-mobile.component.html',
  styleUrls: ['image-product-complete-mobile.component.scss'],
  host: { 'app.image-product-complete-mobile': 'true' }
})
export class ImageProductCompleteMobileComponent extends ViewComponent {

  private _plaform: Platform;

  @Input() imagesVariantsProduct: { path: string; }[] = [];

  showContent: boolean = true;
  currentIndex: number = 1;

  constructor(_injector: Injector) {
    super(_injector);
    this._plaform = _injector.get(Platform);
  }

  get platform() {
    return this._plaform.is('ios') ? 'ios' : 'android';
  }

  slideChange(swiper: any) {
    this.currentIndex = swiper.detail[0].activeIndex + 1;
  }

  dismiss() {
    this.dialog.dismiss('cancel');
  }
}
