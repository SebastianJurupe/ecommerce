import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'list-tablet.component.html',
  styleUrls: ['list-tablet.component.scss'],
  host: { 'app.list-tablet': 'true' }
})
export class ListTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}