import { Component } from '@angular/core';
import { DetailBaseComponent } from '../base/detail-base.component';

@Component({
  selector: 'detail-component-base',
  templateUrl: 'detail-desktop.component.html',
  styleUrls: ['detail-desktop.component.scss'],
  host: { 'app.detail-desktop': 'true' }
})
export class DetailDesktopComponent extends DetailBaseComponent {

}
