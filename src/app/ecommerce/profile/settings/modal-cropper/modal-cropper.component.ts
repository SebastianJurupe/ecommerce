import { Component, Injector, Input, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { CropperComponent } from 'angular-cropperjs';


@Component({
  templateUrl: 'modal-cropper.component.html',
  styleUrls: ['modal-cropper.component.scss'],
})

export class ModalCropperComponent extends ViewComponent {
  @Input() defaultAvatarSrc: any
  img: string = ''
  defaultImg: boolean = false
  constructor(_injector: Injector) {
    super(_injector);

  }

  config: any = {
    aspectRatio: 1,          // Esto asegura un recorte cuadrado (opcional)
    viewMode: 1,             // Esto permite ajustar la vista a un tamaño específico
    dragMode: 'move',        // Esto permite arrastrar la imagen dentro del área de recorte
    autoCropArea: 1,         // Esto establece el área de recorte inicial al 100%
    cropBoxResizable: true, // Esto desactiva la capacidad de cambiar el tamaño del área de recorte
    cropBoxMovable: true,    // Esto desactiva la capacidad de mover el área de recorte
  };


  ngOnInit() {
    const url = this.defaultAvatarSrc;
    const prefix = 'blob:';

    if (url.startsWith(prefix)) {
      const extractedBlob = url.substring(prefix.length);
      this.img = extractedBlob
    } else {
      console.error('La URL no comienza con "blob"');
      this.img = url
    }
    setTimeout(() => {
      this.defaultImg = true
    }, 1000);
  }
  croppedImage: any;

  onExport(event: any) {
    this.croppedImage = event.dataUrl;
  }

  onReady() {
  }
  @ViewChild('angularCropper') public angularCropper!: CropperComponent;
  confirmarRecorte() {

    const resultImage = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    this.dialog.dismiss(resultImage)

  }

  close() {
    this.dialog.dismiss('cancel')
  }
}
