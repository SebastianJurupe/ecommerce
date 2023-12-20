import { Component, Injector, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { IonRadioGroup } from '@ionic/angular';

@Component({
  templateUrl: 'add-billing-tablet.component.html',
  styleUrls: ['add-billing-tablet.component.scss'],
  host: { 'app.add-billing-tablet': 'true' }
})
export class AddBillingTabletComponent extends ViewComponent {

  @ViewChild('radioGroup') radioGroup!: IonRadioGroup;

  companies = [
    { name: "La Samaritana Corporation S.A.C", fiscalNumber: "20713995789", value: "custom-checked" },
    { name: "Negocios del Carmen Portocarreo - NCM Comercial", fiscalNumber: "20723995789", value: "custom2" },
    { name: "Norman Osword Sánchez", fiscalNumber: "27421234", value: "custom3" }
  ];

  valueCompany: object = this.companies[0];

  constructor(_injector: Injector) {
    super(_injector);
  }

  selectRadio(value: any) {
    this.radioGroup.value = value.value;
    this.valueCompany = value;
  }

  changeRadio() {

  }

  save() {
    this.navigation.back("/app/ecommerce/basket/store-pickup", { company: this.valueCompany });
  }

  billingForm() {
    this.navigation.forward("/app/ecommerce/profile/invoicing-form", { path: 'add-billing' });
  }

  close() {
    this.navigation.back("/app/ecommerce/basket/store-pickup");
  }
}
