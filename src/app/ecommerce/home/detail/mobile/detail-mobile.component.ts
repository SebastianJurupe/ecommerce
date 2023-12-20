import { Component } from '@angular/core';
import { DetailBaseComponent } from '../base/detail-base.component';


@Component({
  selector: 'detail-component',
  templateUrl: 'detail-mobile.component.html',
  styleUrls: ['detail-mobile.component.scss'],
  host: { 'app.detail-mobile': 'true' }
})
export class DetailMobileComponent extends DetailBaseComponent {

}
