import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'home-tablet.component.html',
  styleUrls: ['home-tablet.component.scss'],
  host: { 'app.basket.home-tablet': 'true' }
})
export class HomeTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }

}