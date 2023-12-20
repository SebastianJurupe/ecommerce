import { Component } from '@angular/core';
import { HomeDeliveryBaseComponent } from '../base/home-delivery-base.component';
import { ModalCountryComponent } from '@shared/components/modal-country/modal-country.component';

@Component({
  templateUrl: 'home-delivery-mobile.component.html',
  styleUrls: ['home-delivery-mobile.component.scss']
})
export class HomeDeliveryMobileComponent extends HomeDeliveryBaseComponent {

  openCountriesModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryId: this.country.id,
        countryCode: this.country.id
      },
      cssClass: ['modal-custom', 'modal-custom--full']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }
}