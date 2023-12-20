import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'card-item-tablet.component.html',
  styleUrls: ['card-item-tablet.component.scss'],
  host: { 'app.card-item-tablet': 'true' }
})
export class CardItemTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}