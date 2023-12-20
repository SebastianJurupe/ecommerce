import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'code-yape.component.html',
  styleUrls: ['code-yape.component.scss'],
  host: { 'app.code-yape': 'true' }
})
export class CodeYapeComponent extends ViewComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() { }

  buttonClose() {
    this.dialog.dismiss();
  }
}
