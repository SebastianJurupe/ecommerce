import { Component } from '@angular/core';
import { CalendarBaseComponent } from '../base/calendar-base.component';

@Component({
  templateUrl: 'calendar-mobile.component.html',
  styleUrls: ['calendar-mobile.component.scss'],
  host: { 'app.calendar-mobile': 'true' }
})
export class CalendarMobileComponent extends CalendarBaseComponent {

}
