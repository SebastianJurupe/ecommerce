import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'list-address-tablet.component.html',
  styleUrls: ['list-address-tablet.component.scss'],
  host: { 'app.list-address-tablet': 'true' }
})
export class ListAddressTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}