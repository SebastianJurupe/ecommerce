import { Component } from '@angular/core';
import { DetailProductBaseComponent } from '../base/detail-product-base.component';

@Component({
  templateUrl: 'detail-product-mobile.component.html',
  styleUrls: ['detail-product-mobile.component.scss'],
  host: { 'app.detail-product-mobile': 'true' }
})
export class DetailProductMobileComponent extends DetailProductBaseComponent { }
