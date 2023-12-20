import { Component, Injector } from '@angular/core';
import { OrderReceiverBaseComponent } from '../base/order-receiver-base.component';
import { DocumentTypesPopoverComponent, ModalCountryComponent } from '@shared/components';
import { PopoverController } from '@ionic/angular';

@Component({
  templateUrl: 'order-receiver-desktop.component.html',
  styleUrls: ['order-receiver-desktop.component.scss'],
  host: { 'app.order-receiver-desktop': 'true' }
})
export class OrderReceiverDesktopComponent extends OrderReceiverBaseComponent {
  private _popoverController: PopoverController;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  openCountriesModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryCode: this.country.code,
        countryId: this.country.id,
        showCountryCode: true
      },
      showBackdrop: false,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }

  async openDocumentTypesPopover(event: Event) {
    const popover = await this._popoverController.create({
      component: DocumentTypesPopoverComponent,
      event: event,
      alignment: 'start',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        documentTypeId: this.receiverInfo.document.type.id,
      },
      cssClass: ['document-type-popover-desktop'],

    });
    await popover.present();
    const res = await popover.onDidDismiss();
    if (res.data) {
      const { id, name } = res.data;
      this.receiverInfo.document.type = {
        id: id,
        prefix: name,
      };
    }
  }

}