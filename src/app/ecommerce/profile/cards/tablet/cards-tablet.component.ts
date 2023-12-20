import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'cards-tablet.component.html',
  styleUrls: ['cards-tablet.component.scss'],
  host: { 'app.cards-tablet': 'true' }
})
export class CardsTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}