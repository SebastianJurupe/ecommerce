import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { Platform } from '@ionic/angular';

@Component({
  templateUrl: 'image-product-complete-base.component.html',
  styleUrls: ['image-product-complete-base.component.scss'],
  host: { 'app.image-product-complete-base': 'true' }
})
export class ImageProductCompleteBaseComponent extends ViewComponent {

  private _platform: Platform;

  @Input() imagesVariantsProduct: { path: string; }[] = [];

  showContent: boolean = true;
  currentIndex: number = 1;
  platform: string = '';
  currentImagePath: string = '';


  constructor(_injector: Injector) {
    super(_injector);
    this._platform = _injector.get(Platform);
    this.platform = this._platform.is('ios') ? 'ios' : 'android';
  }

  ngOnInit() {
    if (this.imagesVariantsProduct.length > 0) {
      this.currentImagePath = this.imagesVariantsProduct[0].path;
    }
  }
  
  slideChange(swiper: any) {
    this.currentIndex = swiper.detail[0].activeIndex + 1;
  }

  nextImage() {
    if (this.currentIndex < this.imagesVariantsProduct.length) {
      this.currentIndex++;
      this.updateCurrentImagePath();
    }
  }

  previousImage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
      this.updateCurrentImagePath();
    }
  }

  updateCurrentImagePath() {
    this.currentImagePath = this.imagesVariantsProduct[this.currentIndex - 1].path;
  }

  dismiss() {
    this.dialog.dismiss('cancel');
  }

}
