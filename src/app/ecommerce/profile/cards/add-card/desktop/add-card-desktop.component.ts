import { Component, Injector, OnInit } from '@angular/core';
import { AddCardBaseComponent } from '../base/add-card-base.component';

@Component({
  templateUrl: 'add-card-desktop.component.html',
  styleUrls: ['add-card-desktop.component.scss'],
  host: { 'app.add-card-desktop': 'true' }
})
export class AddCardDesktopComponent extends AddCardBaseComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
  }

  saveDesktop() {
    this.submit().then(() => {
      this.dialog.dismiss()
    })
  }

  cancel() {
    this.dialog.dismiss('cancel')
  }
}