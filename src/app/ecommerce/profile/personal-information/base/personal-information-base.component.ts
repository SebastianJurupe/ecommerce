import { Component, Injector } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { ViewComponent } from '@geor360/core';
import { CameraGalleryComponent } from '../../modals/camera-gallery/camera-gallery.component';

@Component({
  templateUrl: 'personal-information-base.component.html',
  styleUrls: ['personal-information-base.component.scss'],
  host: { 'app.personal-information-base': 'true' }
})
export class PersonalInformationBaseComponent extends ViewComponent {

  constructor(_injector: Injector) {
    super(_injector);
  }

  changeProfile() {
    this.dialog.showWithData({
      component: CameraGalleryComponent,
      cssClass: ['modal-custom', 'modal-custom--bottom']
    }).then(res => {
      const response = res.data.result;
      switch (response) {
        case 'camera':
          this.completeCapture(CameraSource.Camera);
          break;
        case 'gallery':
          this.completeCapture(CameraSource.Photos);
          break;

        default:
          this.completeCapture(CameraSource.Camera);
          break;
      }
    });
  }

  async completeCapture(source: CameraSource): Promise<void> {
    try {
      await Camera.getPhoto({
        quality: 40,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: source,
        correctOrientation: true
      });
    } catch (error) {
      console.error(error);
    }
    return;
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/setting');
  }
}
