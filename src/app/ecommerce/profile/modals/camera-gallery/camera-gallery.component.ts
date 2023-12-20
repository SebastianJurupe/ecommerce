import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'camera-gallery.component.html',
  styleUrls: ['camera-gallery.component.scss'],
  host: { 'app.camera-gallery': 'true' }
})
export class CameraGalleryComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  selectOption(option: string) {
    this.dialog.dismiss(option);
  }
}