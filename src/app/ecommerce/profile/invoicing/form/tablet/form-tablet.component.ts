import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'form-tablet.component.html',
  styleUrls: ['form-tablet.component.scss'],
  host: { 'app.form-tablet': 'true' }
})
export class FormTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}