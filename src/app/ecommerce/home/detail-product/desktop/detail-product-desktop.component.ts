import { Component, Injector } from '@angular/core';
import { FreightForwardersDesktopComponent, HomeDeliveryDesktopComponent } from '@shared/components';
import { StoresDesktopComponent } from '@shared/components/stores';
import { LoginTabletComponent } from 'src/app/ecommerce/profile/login';
import { DeliveryTypeOption, DetailProductBaseComponent } from '../base/detail-product-base.component';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'detail-product-desktop.component.html',
  styleUrls: ['detail-product-desktop.component.scss'],
  host: { 'app.detail-product-desktop': 'true' }
})
export class DetailProductDesktopComponent extends DetailProductBaseComponent {

  private _animationModalService: AnimationModalService;

  detailsContainer: boolean = true;
  headerDetailProduct: boolean = true;
  headerVariantsProduct: boolean = false;
  showDelivery: boolean = false;
  variantsDesktop: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
  }

  openDetailsDesktop() {
    this.showDetailComponent = !this.showDetailComponent;
  }

  openDelivery() {
    this.showDelivery = !this.showDelivery;
  }

  override async goTodeliveryTypeMethod(deliveryType: DeliveryTypeOption): Promise<void> {
    if (!this.isAuthenticated) {
      this.dialog
        .showWithData<"confirm" | undefined>({
          component: LoginTabletComponent,
          backdropDismiss: false,
          leaveAnimation: this.animationModalService.closeDesktopModal,
          componentProps: {
            showHeader: false
          },
          cssClass: ['modal-custom', 'modal-custom--in-center-medium']
        });
      return;
    }
    switch (deliveryType.code) {
      case 'AGENCIA':
        this.freightForwardersDeliveryModal();
        break;
      case 'DOMICILIO':
        this.homeDeliveryModal();
        break;
      case 'TIENDA':
        this.storesDeliveryModal();
        break;
    }
  }

  homeDeliveryModal() {
    this.dialog.showWithData({
      component: HomeDeliveryDesktopComponent,
      componentProps: {
        id: this.productId,
        detail: true,
        selectAddressOption: this.selectAddressOption
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    }).then((res: any) => {
      if (res.data.result !== 'cancel') {
        this.selectAddressOption = res.data.result.address
      }
    });
  }

  freightForwardersDeliveryModal() {
    this.dialog.showWithData({
      component: FreightForwardersDesktopComponent,
      componentProps: {
        id: this.productId,
        detail: true,
        selectAddressOption: this.selectAddressOption
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    }).then((res: any) => {
      if (res.data.result !== 'cancel') {
        this.selectAddressOption = res.data.result.address
      }
    });
  }

  storesDeliveryModal() {
    this.dialog.showWithData({
      component: StoresDesktopComponent,
      componentProps: {
        id: this.productId,
        detail: true,
        selectAddressOption: this.selectAddressOption
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    }).then((res: any) => {
      if (res.data.result !== 'cancel') {

        this.selectAddressOption = res.data.result.address
      }
    });
  }

  openExchanges() {
    this.navigation.forward('/app/ecommerce/profile/terms-conditions');
  }

  async openVariantsDesktop() {
    if (!this.isAuthenticated) {
      this.dialog
        .showWithData<"confirm" | undefined>({
          component: LoginTabletComponent,
          backdropDismiss: false,
          enterAnimation: this._animationModalService.openDesktopModal,
          leaveAnimation: this._animationModalService.closeDesktopModal,
          cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
          componentProps: {
            showHeader: false
          },
        });
    } else {
      this.variantsDesktop = !this.variantsDesktop;
      this.headerDetailProduct = !this.headerDetailProduct;
      this.headerVariantsProduct = !this.headerVariantsProduct;
      this.detailsContainer = !this.detailsContainer;
    }
  }

  backDetail() {
    this.variantsDesktop = !this.variantsDesktop;
    this.headerDetailProduct = !this.headerDetailProduct;
    this.headerVariantsProduct = !this.headerVariantsProduct;
    this.detailsContainer = !this.detailsContainer;
  }

  goToHome() {
    this.navigation.backNoAnimation('app/ecommerce/home');
  }
}
