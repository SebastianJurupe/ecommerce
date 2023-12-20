import { Component, Injector, OnInit } from '@angular/core';
import { AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter } from '@ionic/angular';

import { HomeDeliveryMobileComponent } from '@shared/components';
import { DeliveryDetailsPopoverComponent, DeliveryTypeOption } from '../delivery-details-popover/delivery-details-popover.component';
import { DeliveryTypeService } from '../service/delivery-type.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { PaymentMethodsTabletComponent } from '../../payment-methods';
import { NewCardPaymentTabletComponent } from '../../new-card-payment';
import { SavedCardPaymentTabletComponent } from '../../saved-card-payment';
import { DepositPaymentTabletComponent } from '../../deposit-payment';
import { PaymentcashTabletComponent } from '../../paymentcash';
import { AddCouponMobileComponent } from '../../modals/add-coupon';
import { OrderReceiverMobileComponent } from '../../modals/order-receiver';
import { CalendarMobileComponent } from '../../modals/calendar';
import { MyAddressesMobileComponent } from '../../modals/my-addresses';
import { DeliveryRequirementsMobileComponent } from '../../modals/delivery-requirements';
import { FreightForwardersTabletComponent } from '@shared/components/freight-forwarders/tablet/freight-forwarders-tablet.component';
import { StoresMobileComponent } from '@shared/components/stores';

@Component({
  templateUrl: 'store-pickup-tablet.component.html',
  styleUrls: ['store-pickup-tablet.component.scss'],
  host: { 'app.store-pickup-tablet': 'true' }
})
export class StorePickupTabletComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _popoverController: PopoverController;
  private _toolbar: AppTabService;
  private _deliveryTypeStateService: DeliveryTypeService;
  private _paymentMethodsService: PaymentMethodsService;
  private _activatedRoute: ActivatedRoute;
  private _configuration: AppConfigurationService;


  selectedPaymentMethod: string | null = null;
  billingData = {
    name: undefined,
    fiscalNumber: undefined,
  };
  coupon: string = '';
  device: string;
  orderEdit: any = {
  };

  delivery: any;

  deliveryType: DeliveryTypeOption = {
    id: '01',
    label: this.localization.localize('basket.deliveryDetailsPopover.labelHome', 'ecommerce'),
    setBackground: true,
    classIconButton: 'icon icon--location icon--success',
    setArrow: false,
    type: 'DOMICILIO',
    shapeIconBackground: 'rectangle',
    shapeType: 'success',
  };

  typeOfShipment = {
    classIconButton: 'icon icon--ray icon--14 icon--shape',
    label: this.localization.localize('basket.storePickup.typeOfShipmentItemPlaceholder', 'ecommerce'),
    type: 'success',
    method: () => this.selectTypeOfShipment()
  };

  selectAgencyOption = {
    classIconButton: 'icon icon--truck',
    label: this.localization.localize('basket.storePickup.agencyOptionItemPlaceholder', 'ecommerce'),
    method: () => this.selectAgency()
  };

  selectShopOption = {
    classIconButton: 'icon icon--location',
    label: this.localization.localize('basket.storePickup.storeItemPlaceholder', 'ecommerce'),
    classLabel: 'text--secondary',
    method: () => this.selectShop()
  };

  selectAddressOption = {
    classIconButton: 'icon icon--location',
    label: this.localization.localize('basket.storePickup.addressItemPlaceholder', 'ecommerce'),
    classLabel: 'text--secondary',
    method: () => this.selectAddress()
  };

  selectDateOfReceiveOption = {
    classIconButton: 'icon icon--calendar',
    label: 'Llega el 26 dic, 8:00am - 9:00am',
    method: () => this.selectDateOfReceive()
  };

  selectReceiverOption = {
    classIconButton: 'icon icon--profile',
    label: this.localization.localize('basket.storePickup.authorizationItemPlaceholder', 'ecommerce'),
    classLabel: 'text--secondary',
    method: () => this.selectReceiver()
  };

  deliveryRequirementsOption = {
    classIconButton: 'icon icon--paper-negative',
    label: this.localization.localize('basket.storePickup.requerimentsItemPlaceholder', 'ecommerce'),
    classLabel: 'text--secondary',
    method: () => this.deliveryRequirements()
  };

  paymentMethod = {
    type: null,
    label: null
  };

  summaryDetails = [
    {
      label: this.localization.localize('basket.storePickup.priceBoxTitle', 'ecommerce'),
      data: 'S/9,999.00'
    },
    {
      label: this.localization.localize('basket.storePickup.deliveryBoxTitle', 'ecommerce'),
      data: 'S/45.90'
    },
    {
      label: this.localization.localize('basket.storePickup.couponBoxTitle', 'ecommerce'),
      data: '-S/180.00'
    },
    {
      label: this.localization.localize('basket.storePickup.totalBoxTitle', 'ecommerce'),
      data: '12,589.00'
    }
  ];

  paymentMethodIcons: { [key: string]: string; } = {
    'Nueva tarjeta': 'icon icon--card-pay icon--46x32',
    'Visa Débito *** 4115': 'icon icon--logo-visa icon--46x32',
    'Depósito o transferencia': 'icon icon--avatar-company icon--46x32',
    // 'Yape': 'icon icon--logo-yape icon--46x32',
    'Pago efectivo': 'icon icon--efect-pay icon--46x32',
    'Paypal': 'icon icon--logo-paypal icon--46x32',
  };

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
    this._toolbar = _injector.get(AppTabService);
    this._paymentMethodsService = _injector.get(PaymentMethodsService);
    this._deliveryTypeStateService = _injector.get(DeliveryTypeService);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ngOnInit() {
    this._deliveryTypeStateService.setDelivery('home');
    this._deliveryTypeStateService.getDelivery().subscribe((res) => {
      this.delivery = res;
    });
    this._paymentMethodsService.selectedPaymentMethod$.subscribe((paymentMethod) => {
      this.selectedPaymentMethod = paymentMethod;
    });
  }

  ionViewWillEnter() {
    this._toolbar.hide();
    const { company } = this._activatedRoute.snapshot.queryParams;

    if (company !== undefined) {
      this.billingData = company;
    }

    const { order } = this._activatedRoute.snapshot.queryParams;
    order && (this.orderEdit = JSON.parse(order));
    if (order !== undefined) {
      this.selectAddressOption.label = this.orderEdit.address;
      this.selectAddressOption.classLabel = 'text--primary';
      this.selectReceiverOption.label = this.orderEdit.receiver;
      this.selectReceiverOption.classLabel = 'text--primary';
      this.deliveryRequirementsOption.label = this.orderEdit.delivery;
      this.deliveryRequirementsOption.classLabel = 'text--primary';

      this.selectedPaymentMethod = 'Pago efectivo';

      this.billingData.name = this.orderEdit.billing.name;
      this.billingData.fiscalNumber = this.orderEdit.billing.fiscalNumber;
    }
  }

  async deliveryDetailsPopover(event: Event) {
    const popover = await this._popoverController.create({
      component: DeliveryDetailsPopoverComponent,
      event: event,
      alignment: 'end',
      mode: 'ios',
      size: 'cover',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        deliveryTypeId: this.deliveryType.id
      }
    });

    await popover.present();

    const res = await popover.onDidDismiss();

    if (res.data) {
      this.deliveryType = res.data;
    }
  }

  selectTypeOfShipment() {
    this.dialog.showWithData<"cancel" | any>({
      component: HomeDeliveryMobileComponent,
      componentProps: {
        type: 'modal'
      },
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        const { classIconButton, label } = response.data.result;
        this.typeOfShipment.label = label;
        if (classIconButton.includes('icon icon--ray')) {
          this.typeOfShipment.classIconButton = `${classIconButton} icon--14`;
        } else {
          this.typeOfShipment.classIconButton = classIconButton;
        }
      }
    });
  }

  selectAgency() {
    this.dialog.showWithData<"cancel" | any>({
      component: FreightForwardersTabletComponent,
      componentProps: {
        type: 'modal'
      },
    });
  }

  selectShop() {
    this.dialog.showWithData<"cancel" | any>({
      component: StoresMobileComponent,
      componentProps: {
        type: 'modal'
      },
    });
  }

  selectAddress() {
    this.dialog.showWithData<"cancel" | string>({
      component: MyAddressesMobileComponent,
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        this.selectAddressOption.label = response.data.result;
      }
    });
  }

  selectDateOfReceive() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: CalendarMobileComponent,
    }).then((_response) => {
      // !!! PENDING
    });
  }

  selectReceiver() {
    this.dialog.showWithData<"cancel" | string>({
      component: OrderReceiverMobileComponent,
      componentProps: {
      },
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        this.selectReceiverOption.label = response.data.result;
        this.selectReceiverOption.classLabel = 'text--primary';
      }
    });

  }

  deliveryRequirements() {
    this.dialog.showWithData<"cancel" | string>({
      component: DeliveryRequirementsMobileComponent,
      componentProps: {
      },
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        this.deliveryRequirementsOption.label = response.data.result;
        this.deliveryRequirementsOption.classLabel = 'text--primary';
      }
    });
  }

  selectCoupon() {
    this.dialog.showWithData<"cancel" | string>({
      component: AddCouponMobileComponent,
      componentProps: {
      }
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { cod } = response.data.result;
        this.coupon = cod;
      }
    });
  }

  payMethods() {
    this.navigation.forward('app/ecommerce/basket/payment-methods');
  }

  payMethodsModal() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: PaymentMethodsTabletComponent,
      componentProps: {
      }
    });
  }

  navigateToPayment() {
    switch (this.selectedPaymentMethod) {
      case 'Nueva tarjeta':
        this.newTargetModal();
        break;
      case 'Visa Débito *** 4115':
        this.savedTargetModal();

        break;
      case 'Depósito o transferencia':
        this.depositPaymentModal();
        break;
      case 'Pago efectivo':
        this.payEfectModal();
        break;
      case 'Paypal':
        this.payPal();
        break;
    }
  }

  newTargetModal() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: NewCardPaymentTabletComponent,
      componentProps: {
      }
    });
  }

  savedTargetModal() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: SavedCardPaymentTabletComponent,
      componentProps: {
      }
    });
  }

  depositPaymentModal() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: DepositPaymentTabletComponent,
      componentProps: {
      }
    });
  }

  payEfectModal() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: PaymentcashTabletComponent,
      componentProps: {
      }
    });
  }

  payPal() {
    const paypalLink = 'https://www.paypal.com/pe/signin';
    window.open(paypalLink, '_blank');
  }


  selectBilling() {
    this.navigation.forward("/app/ecommerce/basket/add-billing");
  }

  back() {
    const { order } = this._activatedRoute.snapshot.queryParams;
    if (order !== undefined) {
      this.navigation.forward('/app/ecommerce/profile/order-detail', { order: this.orderEdit });
    } else {
      this._toolbar.show();
      this.navigation.back('app/ecommerce/basket/home');
    }
  }
}
