import { Component, Injector } from '@angular/core';
import { DeleteInvoiceDesktopComponent } from '../../../modals/delete-invoice/desktop/delete-invoice-desktop.component';
import { FormDesktopComponent } from '../../form';
import { InvoiceItemEmitterOptionCliked } from '../../invoice-item';
import { ListBaseComponent } from '../base/list-base.component';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'list-desktop.component.html',
  styleUrls: ['list-desktop.component.scss'],
  host: { 'app.list-desktop': 'true' }
})
export class ListDesktopComponent extends ListBaseComponent {

  private _animationModalService: AnimationModalService;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
  }

  override ionViewWillEnter() {
    this.toolbar.show();
  }

  addInvoice() {
    this.dialog.showWithData<"cancel" | string>({
      component: FormDesktopComponent,
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    });
  }

  async editModal(emitter: InvoiceItemEmitterOptionCliked) {
    const { id, edit } = emitter;

    if (edit) {
      this.dialog.showWithData<"cancel" | string>({
        component: FormDesktopComponent,
        componentProps: {
          edit: true,
          id: id
        },
        enterAnimation: this._animationModalService.openDesktopModal,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      });
    } else {
      this.handleDelete(id);
    }
  }

  handleDelete(id: number) {
    this.dialog.showWithData({
      component: DeleteInvoiceDesktopComponent,
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-small']
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
}