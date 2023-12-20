import { Component, OnInit } from '@angular/core';
import { VariantsBaseComponent } from '../base/variants-base.component';


@Component({
  templateUrl: 'variants-mobile.component.html',
  styleUrls: ['variants-mobile.component.scss'],
  host: { 'app.variants-mobile': 'true' }
})
export class VariantsMobileComponent extends VariantsBaseComponent implements OnInit{

}