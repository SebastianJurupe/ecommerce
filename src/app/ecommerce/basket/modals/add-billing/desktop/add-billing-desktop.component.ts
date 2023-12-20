import { Component, Injector, Input } from '@angular/core';
import { AddBillingBaseComponent } from '../base/add-billing-base.component';
import { FormDesktopComponent } from 'src/app/ecommerce/profile/invoicing/form';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'add-billing-desktop.component.html',
  styleUrls: ['add-billing-desktop.component.scss'],
  host: { 'app.add-billing-desktop': 'true' }
})
export class AddBillingDesktopComponent extends AddBillingBaseComponent {

  private _animationModalService: AnimationModalService;

  @Input() payment: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
  }

  ionViewWillEnter() {
    this._toolbar.show();
  }

  save() {
    if (this.payment) {
      this.dialog.dismiss(this.selectedBilling);
    } else {
      this.billingService.setStorePickupInvoice(this.selectedBilling);
      this.dialog.dismiss();
    }
    this.invoicesSubscription?.unsubscribe();
  }

  createBilling() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: FormDesktopComponent,
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      showBackdrop: false,
    });
  }

  editBilling(id: number) {
    this.dialog.showWithData<"cancel" | undefined>({
      component: FormDesktopComponent,
      componentProps: { id: id, edit: true },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      showBackdrop: false,
    });
    // this.navigation.forward(`/app/ecommerce/profile/invoicing-form?path=edit-billing-basket&id=${id}`);
  }

  onBackButtonPressed() {
    this.dialog.dismiss('cancel');
  }
}