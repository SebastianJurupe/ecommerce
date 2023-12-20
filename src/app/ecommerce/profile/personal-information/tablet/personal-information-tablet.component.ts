import { Component, Injector } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { ViewComponent } from '@geor360/core';
import { CameraGalleryComponent } from '../../modals/camera-gallery/camera-gallery.component';
import { NameTabletComponent } from '../../modals/name/tablet/name-tablet.component';
import { PhoneTabletComponent } from '../../modals/phone/tablet/phone-tablet.component';
import { PasswordTabletComponent } from '../../modals/password/tablet/password-tablet.component';
import { EmailTabletComponent } from '../../modals/email/tablet/email-tablet.component';

@Component({
  templateUrl: 'personal-information-tablet.component.html',
  styleUrls: ['personal-information-tablet.component.scss'],
  host: { 'app.personal-information-tablet': 'true' }
})
export class PersonalInformationTabletComponent extends ViewComponent {

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

  showModalName() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: NameTabletComponent,
      componentProps: {
      }
    });
  }

  showModalEmail() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: EmailTabletComponent,
      componentProps: {
      }
    });
  }

  showModalPhone() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: PhoneTabletComponent,
      componentProps: {
      }
    });
  }

  showModalPassword() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: PasswordTabletComponent,
      componentProps: {
      }
    });
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/setting');
  }
}
