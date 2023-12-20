import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { HomeBaseComponent } from '../base/home-base.component';

@Component({
  templateUrl: 'home-mobile.component.html',
  styleUrls: [
    'home-mobile.component.scss',
    './../base/home-base.component.scss'
  ],
  host: { 'app.home.home-mobile': 'true' }
})
export class HomeMobileComponent extends HomeBaseComponent implements OnInit, ViewWillEnter {

  @ViewChild('content') override content!: IonContent;

  breakpoints = {
    320: {
      slidesPerView: 1.170,
      spaceBetween: 10
    },
    375: {
      slidesPerView: 1.150,
      spaceBetween: 10
    },
    425: {
      slidesPerView: 1.2,
    },
  };

  constructor(_injector: Injector) {
    super(_injector);
  }

  handleOffsetTop(offset: number, hasVariants: boolean) {
    if (offset !== 0 && !hasVariants) {
      this.content.scrollToPoint(0, offset - 300, 1000);
    }
  }


}