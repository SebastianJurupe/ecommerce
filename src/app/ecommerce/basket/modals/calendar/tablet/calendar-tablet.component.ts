import { Component, Injector, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'calendar-tablet.component.html',
  styleUrls: ['calendar-tablet.component.scss'],
  host: { 'app.calendar-tablet': 'true' }
})
export class CalendarTabletComponent extends ViewComponent {

  @ViewChild('radioGroup') radioGroup: any;

  options = [
    { time: "8:00am - 1:00pm", price: "30.00", value: "custom-checked" },
    { time: "2:00am - 5:00pm", price: "30.00", value: "custom" },
  ];

  dates = [
    { date: "Lun 29 jun", selected: 'true' },
    { date: "Mar 30 jun", selected: 'false' },
    { date: "Mie 01 jul", selected: 'false' },
    { date: "Jue 02 jul", selected: 'false' },
    { date: "Vie 03 jul", selected: 'false' },
    { date: "Sáb 04 jul", selected: 'false' },
    { date: "Dom 05 jul", selected: 'false' },
    { date: "Lun 06 jul", selected: 'false' },
    { date: "Mar 07 jul", selected: 'false' }
  ];

  constructor(_injector: Injector) {
    super(_injector);
  }

  selectRadio(value: any) {
    this.radioGroup.value = value;
  }

  close() {
    this.dialog.dismiss();
  }
}
