import { Component, Injector } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OptionsPopoverComponent } from '../../options-popover/options-popover.component';
import { InvoiceItemEmitterOptionCliked } from '../../invoice-item';
import { ListBaseComponent } from '../base/list-base.component';
import { DeleteInvoiceComponent } from '../../../modals/delete-invoice/mobile/delete-invoice.component';

@Component({
  templateUrl: 'list-mobile.component.html',
  styleUrls: ['list-mobile.component.scss'],
  host: { 'app.list-mobile': 'true' }
})
export class ListMobileComponent extends ListBaseComponent {

  private _popoverController: PopoverController;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  async openPopover(emitter: InvoiceItemEmitterOptionCliked) {
    const { id, event } = emitter;
    const popover = await this._popoverController.create({
      component: OptionsPopoverComponent,
      event: event,
      alignment: 'end',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        id: id
      },
      cssClass: ['invoice-popover']
    });

    await popover.present();

    const res = await popover.onDidDismiss();
    if (res.data) {
      const { option, id } = res.data;
      option === 'edit'
        ? this.navigation.forward('/app/ecommerce/profile/invoicing-form', { path: 'edit', id: id })
        : this.handleDelete(id);
    }
  }

  addInvoice() {
    this.navigation.forward('/app/ecommerce/profile/invoicing-form', { path: 'invoicing-list' });
  }

  handleDelete(id: number) {
    this.dialog.showWithData({
      component: DeleteInvoiceComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    }).then(async (res) => {
      if (res.data.result !== 'cancel') {
        const succesfullyDeleted = await this.billingService.deleteById(id);

        if (succesfullyDeleted) {
          const message: string = this.localization.localize('profile.invoice.deleteInvoice.succesfullyDeleted', 'ecommerce');
          this.notify.success(message, 2500);
        }
      }
    });
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/home');
    this.toolbar.show();
  }
}
