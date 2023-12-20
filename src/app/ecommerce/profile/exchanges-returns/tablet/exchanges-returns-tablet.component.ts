import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  selector: 'exchanges-returns',
  templateUrl: 'exchanges-returns-tablet.component.html',
  styleUrls: ['exchanges-returns-tablet.component.scss'],
  host: { 'app.exchanges-returns-tablet': 'true' }
})
export class ExchangesReturnsTabletComponent extends ViewComponent {
  @Input() onlyContent : boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
  }

}
