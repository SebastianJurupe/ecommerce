import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'conditions-tablet.component.html',
  styleUrls: ['conditions-tablet.component.scss'],
  host: { 'app.conditions-tablet': 'true' }
})
export class ConditionsTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}