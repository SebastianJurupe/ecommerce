import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'book-of-claims-tablet.component.html',
  styleUrls: ['book-of-claims-tablet.component.scss'],
  host: { 'app.book-of-claims-tablet': 'true' }
})
export class BookOfClaimsTabletComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }
}