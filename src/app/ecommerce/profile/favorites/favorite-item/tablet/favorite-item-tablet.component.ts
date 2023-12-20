import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'favorite-item-tablet.component.html',
  styleUrls: ['favorite-item-tablet.component.scss'],
  host: { 'app.favorite-item-tablet': 'true' }
})
export class FavoriteItemTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}