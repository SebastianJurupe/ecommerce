import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'add-card-tablet.component.html',
  styleUrls: ['add-card-tablet.component.scss'],
  host: { 'app.add-card-tablet': 'true' }
})
export class AddCardTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}