import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'img[appImgBroken]'
})
export class ImgBrokenDirective {
  @HostListener('error') handleError():void{
    const elNative=this.elHost.nativeElement
    //Link
    //elNative.src='https://img.freepik.com/vector-premium/simbolo-error_592324-8315.jpg'
    elNative.src='../../../assets/error.png'
    }
      constructor(private elHost: ElementRef) {

    }

}
