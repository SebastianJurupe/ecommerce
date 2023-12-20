import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'map-tablet.component.html',
  styleUrls: ['map-tablet.component.scss'],
  host: { 'app.map-tablet': 'true' }
})
export class MapTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}