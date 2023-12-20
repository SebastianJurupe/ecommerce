import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'my-addresses-tablet.component.html',
  styleUrls: ['my-addresses-tablet.component.scss'],
  host: { 'app.my-addresses-tablet': 'true' }
})
export class MyAddressesTabletComponent extends ViewComponent implements OnInit {

  @ViewChild('radioGroup') radioGroup: any;

  addresses = [
    { description: "Jr. Samaritanos 879  Miraflores, Lima, Lima, Perú", value: "custom-checked" },
    { description: "Jr. Enrique Segobiano 879  Miraflores, Lima, Lima, Perú", value: "custom" }
  ];

  constructor(_injector: Injector) {
    super(_injector);
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  save() {
    this.dialog.dismiss("Jr. Samaritanos 879  Miraflores, Lima, Lima, Perú");
  }

  selectRadio(value: any) {
    this.radioGroup.value = value;
  }

  close() {
    this.dialog.dismiss('cancel');
  }

}
