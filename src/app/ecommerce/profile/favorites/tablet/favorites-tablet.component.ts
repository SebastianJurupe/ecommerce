import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'favorites-tablet.component.html',
  styleUrls: ['favorites-tablet.component.scss'],
  host: { 'app.favorites-tablet': 'true' }
})
export class FavoritesTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}