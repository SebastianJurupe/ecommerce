import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { Platform, PopoverController } from '@ionic/angular';
import { FreightForwardersDesktopComponent, FreightForwardersMobileComponent, HomeDeliveryDesktopComponent, HomeDeliveryMobileComponent, StoresDesktopComponent, StoresMobileComponent } from '@shared/components';
import { BasketServiceProxy } from '@shared/proxies/basket/basket.proxie.service';
import { ShippingServiceProxy } from '@shared/proxies/public/shipping.proxie';
import { BasketService } from '@shared/services/basket.service';
import { Subscription } from 'rxjs';
import { Address, AddressService } from 'src/app/ecommerce/profile/address/services/address.service';
import { BillingService } from 'src/app/ecommerce/profile/invoicing/invoicing.service';
import { AddBillingDesktopComponent } from '../../modals/add-billing';
import { AddCouponMobileComponent } from '../../modals/add-coupon';
import { CalendarDesktopComponent, CalendarMobileComponent } from '../../modals/calendar';
import { CouponDesktopComponent } from '../../modals/coupon/coupon-desktop.component';
import { DeliveryRequirementsDesktopComponent, DeliveryRequirementsMobileComponent } from '../../modals/delivery-requirements';
import { MyAddressesDesktopComponent, MyAddressesMobileComponent } from '../../modals/my-addresses';
import { OrderReceiverDesktopComponent, OrderReceiverMobileComponent } from '../../modals/order-receiver';
import { PaymentMethodsComponent } from '../../modals/payment-methods/payment-methods.component';
import { PaymentMethodsDesktopComponent, PaymentMethodsMobileComponent } from '../../payment-methods';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { SuccessPaymentDesktopComponent, SuccessPaymentMobileComponent } from '../../success-payment';
import { DeliveryDetailsPopoverComponent, DeliveryTypeOption } from '../delivery-details-popover/delivery-details-popover.component';
import { DeliveryTypeService } from '../service/delivery-type.service';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { OrdersService } from 'src/app/ecommerce/profile/orders/orders.service';

interface Agency {
  lead_time: number;
  price: number;
  logo: string;
  name: string;
}

interface Invoice {
  id: number | null;
  business_name: string;
  tax_identifier: string;
}

@Component({
  templateUrl: 'store-pickup-base.component.html',
  styleUrls: ['store-pickup-base.component.scss'],
  host: { 'app.store-pickup-base': 'true' }
})
export class StorePickupBaseComponent extends ViewComponent {

  _activatedRoute: ActivatedRoute;
  private _addressService: AddressService;
  private _animationModalService: AnimationModalService;
  private _appConfigurationService: AppConfigurationService;
  private _basketService: BasketService;
  private _basketServiceProxy: BasketServiceProxy;
  _deliveryTypeStateService: DeliveryTypeService;
  private _ordersService: OrdersService;
  _paymentMethodsService: PaymentMethodsService;
  private _platform: Platform;
  private _shippingServiceProxy: ShippingServiceProxy;
  private _subscription: Subscription = new Subscription();
  private _subscriptionAddress: Subscription = new Subscription();


  billingService: BillingService;
  popoverController: PopoverController;
  toolbar: AppTabService;
  addresses: Address[] = [];
  selectedPaymentMethod: string = '';
  selectedInvoice: Invoice = {
    id: null,
    business_name: '',
    tax_identifier: '',
  };
  totalToPay: string = '';
  coupon: string = '';
  orderEdit: any = {};
  delivery: any;
  editOrder: boolean = false;
  data: any;
  cartData: any = {};
  shipping_days: any;
  deliveryCost: string = '';
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

  selectAddressOption: Address = {
    id: 0,
    address: '',
    country: '',
    default: false,
    description: '',
    extra: [],
    postal_code: ''
  };

  defaultAddressOption: Address = {
    id: 0,
    address: '',
    country: '',
    default: false,
    description: '',
    extra: [],
    postal_code: ''
  };

  selectDateOfReceiveOption = {
    classIconButton: 'icon icon--calendar',
    label: this.localization.localize('basket.storePickup.dateDelivery', 'ecommerce'),
    method: () => this.selectDateOfReceive()
  };

  selectReceiverOption = {
    classIconButton: 'icon icon--profile',
    label: this.localization.localize('basket.storePickup.authorizationItemPlaceholder', 'ecommerce'),
    classLabel: 'text--secondary',
    sublabel: '',
    method: () => this.selectReceiver()
  };

  deliveryRequirementsOption = {
    classIconButton: 'icon icon--paper-negative',
    label: '',
    classLabel: 'text--secondary',
    method: () => this.deliveryRequirements()
  };

  paymentMethod = {
    type: null,
    label: null
  };

  summaryDetails = [
    {
      id: 'delivery-cost',
      label: this.localization.localize('basket.storePickup.deliveryBoxTitle', 'ecommerce'),
      data: '0.00'
    },
    {
      id: 'coupon',
      label: this.localization.localize('basket.storePickup.couponBoxTitle', 'ecommerce'),
      data: '0.00'
    },
  ];

  paymentMethodIcons: { [key: string]: string; } = {
    'Nueva tarjeta': 'icon icon--card-pay icon--46x32',
    'Visa Débito *** 4115': 'icon icon--logo-visa icon--46x32',
    'Depósito o transferencia': 'icon icon--payment icon--46x32',
    'Pago efectivo': 'icon icon--efect-pay icon--46x32',
    'Paypal': 'icon icon--logo-paypal icon--46x32',
  };

  agencies: any;
  store: any;
  device: string = '';
  arrives_from: any;
  arrives_to: any;
  arrives_from_to_agency: any;
  arrives_from_to_agency_front: any;
  arrives_to_to_agency: any;
  deliveryAvailable = true;
  firsTimeInvoice: boolean = true;
  firsTimeOrderReceiver: boolean = true;
  firsTimeInvoiceMobile: boolean = true;
  dataReceiver: any;
  nameReceiver: string = '';
  nameRequirement: string = '';
  confirmOrderBoolean: boolean = false
  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._addressService = _injector.get(AddressService);
    this._animationModalService = _injector.get(AnimationModalService);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._basketService = _injector.get(BasketService);
    this._basketServiceProxy = _injector.get(BasketServiceProxy);
    this._deliveryTypeStateService = _injector.get(DeliveryTypeService);
    this._ordersService = _injector.get(OrdersService);
    this._paymentMethodsService = _injector.get(PaymentMethodsService);
    this._platform = _injector.get(Platform);
    this._shippingServiceProxy = _injector.get(ShippingServiceProxy);
    this.billingService = _injector.get(BillingService);
    this.device = this._appConfigurationService.screen();
    this.popoverController = _injector.get(PopoverController);
    this.toolbar = _injector.get(AppTabService);
  }

  get enterAnimation() {
    return this._appConfigurationService.screen() === 'mobile'
      ? undefined
      : this._animationModalService.openDesktopModal;
  }

  get leaveAnimation() {
    return this._appConfigurationService.screen() === 'mobile'
      ? undefined
      : this._animationModalService.closeDesktopModal;
  }

  ngOnInit() {
    this._deliveryTypeStateService.setDelivery('home');
    this._deliveryTypeStateService.getDelivery()
      .subscribe((res) => {
        this.delivery = res;
      });
    this._paymentMethodsService.selectedPaymentMethod$
      .subscribe((paymentMethod) => {
        this.selectedPaymentMethod = paymentMethod || '';
      });

    this.billingService.selectedStorePickupInvoice$
      .subscribe((selectedStorePickupInvoice) => {
        const { id, business_name, tax_identifier } = selectedStorePickupInvoice;
        this.selectedInvoice.id = id;
        this.selectedInvoice.business_name = business_name;
        this.selectedInvoice.tax_identifier = tax_identifier;
      });
    this.setDefaultAddress();
    this.setDefaultInvoice();
    this.setSelectedAddress();
    const { data } = this._activatedRoute.snapshot.queryParams;
    this.data = JSON.stringify(data);
  }

  ionViewWillLeave() {
    this._subscriptionAddress?.unsubscribe();

  }

  setDefaultAddress() {
    this._addressService.getAll().then(() => {
      this._subscriptionAddress = this._addressService.addresses$
        .subscribe({
          next: (addresses) => {
            if (addresses.length === 0) { return; }
            const defaultAddress = addresses.find((address: Address) => address.default) as Address;
            if (defaultAddress) {
              this.selectAddressOption = defaultAddress;
              this.defaultAddressOption = defaultAddress;
              this.calculateDeliveryCost(defaultAddress);
            }
          },
          error: (err) => {
          }
        });
    });
  }

  calculateDeliveryCost(address: Address) {
    this.selectDateOfReceiveOption.label = `${this.localization.localize("basket.storePickup.arrives", "ecommerce")} ${this.getCurrentDateFormatted(this.shipping_days)}, 8:00am - 12:00pm`;
    this._shippingServiceProxy.getCalculate('DOMICILIO', undefined, undefined, address.extra[2].ubigeo)
      .subscribe({
        next: (response) => {
          this.deliveryAvailable = true;
          const { total } = response.data;
          this.shipping_days = response.data.type.lead_time;
          this.deliveryCost = total;
          this.selectDateOfReceiveOption.label = `${this.localization.localize("basket.storePickup.arrives", "ecommerce")} ${this.getCurrentDateFormatted(this.shipping_days)}, 8:00am - 12:00pm`;
          this.arrives_to = `${this.getCurrentDateFormattedPost(this.shipping_days, true)}`;
          this.arrives_from = `${this.getCurrentDateFormattedPost(this.shipping_days, false)}`;
          this.summaryDetails[0].data = `${total.toFixed(2)}`;
        },
        error: (error: ApiException) => {
          this.deliveryAvailable = false;

        }
      });
  }

  setSelectedAddress() {
    this._addressService.selectedAddress$
      .subscribe({
        next: (result) => {
          if (result === null) { return; }
          const { id, address } = result;
          this.selectAddressOption.id = id;
          this.selectAddressOption.address = address;
        },
        error: (err) => {
        }
      });
  }

  setDefaultInvoice() {
    this.billingService.getAll();
    this.billingService.invoices$
      .subscribe({
        next: (billings) => {
          if (billings.length === 0) { return; }
          const defaultInvoice = billings.find(billing => billing.default);
          if (!defaultInvoice) return;
          const { id, business_name, tax_identifier } = defaultInvoice;
          this.selectedInvoice.id = id;
          this.selectedInvoice.business_name = business_name;
          this.selectedInvoice.tax_identifier = tax_identifier;
        },
        error: (err) => {
        }
      });
  }

  getCartItems() {
    this._basketServiceProxy.getCart()
      .subscribe({
        next: (response) => {
          this.cartData = response.data;
          if (response.data === undefined || response.data === null) {
            this.navigation.backNoAnimation('/app/ecommerce/home/home');
          }
        },
        error: (error: ApiException) => { this.message.exception(error); }
      });
  }

  async deliveryDetailsPopover(event: Event) {
    const classPopover = this.device === 'mobile' ? '' : 'desktop';
    const popover = await this.popoverController.create({
      component: DeliveryDetailsPopoverComponent,
      event: event,
      alignment: 'start',
      mode: 'ios',
      size: 'auto',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        deliveryTypeId: this.deliveryType.id
      },
      cssClass: ['delivery-details-popover', classPopover]
    });
    await popover.present();
    const res = await popover.onDidDismiss();
    if (res.data) {
      if (this.deliveryType.id !== res.data.id) {
        this.agencies = undefined;
        this.store = undefined;
        this.summaryDetails[0].data = "0.00";
      }
      this.deliveryType = res.data;
      if (this.deliveryType.id === '01') {
        this.selectAddressOption = this.defaultAddressOption;
        this.summaryDetails[0].data = `${(+this.deliveryCost).toFixed(2)}`;
      }

    }

  }

  selectTypeOfShipment() {
    const classModal = this.device === 'mobile' ? 'modal-custom--full' : 'modal-custom--in-center-medium';
    const modalComponente = this.device === 'mobile' ? HomeDeliveryMobileComponent : HomeDeliveryDesktopComponent;
    this.dialog.showWithData<"cancel" | any>({
      component: modalComponente,
      componentProps: {
        type: 'modal',
        shoppingCart: true,
        selectAddressOption: this.selectAddressOption
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal],
    }).then((response) => {
      if (response.data === undefined) { return; }
      if (response.data.result !== 'cancel') {
        const { classIconButton, label, type } = response.data.result.selectedSendType;
        this.typeOfShipment.label = label;
        this.typeOfShipment.type = type;
        this.selectAddressOption = response.data.result.address;
        this.defaultAddressOption = response.data.result.address;
        this.deliveryAvailable = true;
        this.calculateDeliveryCost(this.defaultAddressOption);
        if (classIconButton.includes('icon icon--ray')) {
          this.typeOfShipment.classIconButton = `${classIconButton} icon--14`;
        } else {
          this.typeOfShipment.classIconButton = classIconButton;
          this.typeOfShipment.type = type;
        }
      }
    });
  }

  selectAgency() {
    const classModal = this.device === 'mobile' ? 'modal-custom--full' : 'modal-custom--in-center-medium';
    const modalComponente = this.device === 'mobile' ? FreightForwardersMobileComponent : FreightForwardersDesktopComponent;
    this.dialog.showWithData<"cancel" | Agency>({
      component: modalComponente,
      componentProps: {
        type: 'modal',
        shoppingCart: true,
        selectAddressOption: this.selectAddressOption
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal],
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.agencies = response.data.result.agency;
        this.selectAddressOption = response.data.result.address;
        this.arrives_to_to_agency = `${this.getCurrentDateFormattedPost(response.data.result.agency.lead_time, true)}`;
        this.arrives_from_to_agency = `${this.getCurrentDateFormattedPost(response.data.result.agency.lead_time, false)}`;
        this.summaryDetails[0].data = `${response.data.result.agency.price.toFixed(2)}`;
      }
    });
  }

  selectShop() {
    const classModal = this.device === 'mobile' ? 'modal-custom--full' : 'modal-custom--in-center-medium';
    const modalComponente = this.device === 'mobile' ? StoresMobileComponent : StoresDesktopComponent;
    this.dialog.showWithData<"cancel" | any>({
      component: modalComponente,
      componentProps: {
        type: 'modal',
        shoppingCart: true,
        selectAddressOption: this.selectAddressOption
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal]
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.store = response.data.result.store;
        this.selectAddressOption = response.data.result.address;
        this.arrives_from_to_agency_front = this.getCurrentDateFormattedPostShop(response.data.result.store.lead_time, true);
        this.arrives_to_to_agency = `${this.getCurrentDateFormattedPost(response.data.result.store.lead_time, true)}`;
        this.arrives_from_to_agency = `${this.getCurrentDateFormattedPost(response.data.result.store.lead_time, false)}`;
        this.summaryDetails[0].data = "0.00";
      }
    });
  }

  selectAddress() {
    const classModal = this.device === 'mobile' ? 'modal-custom--full' : 'modal-custom--in-center-medium';
    const modalComponente = this.device === 'mobile' ? MyAddressesMobileComponent : MyAddressesDesktopComponent;
    this.dialog.showWithData({
      component: modalComponente,
      componentProps: {
        usedAsModal: true,
        selectedAddress: this.selectAddressOption
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal],
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        this.selectAddressOption = response.data.result as Address;
      }
    });
  }

  selectDateOfReceive() {
    const classModal = this.device === 'mobile' ? '' : 'modal-custom--in-center-medium';
    const modalComponente = this.device === 'mobile' ? CalendarMobileComponent : CalendarDesktopComponent;
    this.dialog.showWithData<"cancel" | any>({
      component: modalComponente,
      componentProps: {
        shipping_days: this.shipping_days,
        dateSelected: this.arrives_from,
        costDelivery: this.summaryDetails[0].data
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal]
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        if (!response.data.result.state) {
          this.arrives_from = this.getCurrentDateFormattedPostMorning(0, true, response.data.result.from);
          this.arrives_to = this.getCurrentDateFormattedPostMorning(0, false, response.data.result.to);
          this.selectDateOfReceiveOption.label = `${this.localization.localize("basket.storePickup.arrives", "ecommerce")} ${this.getCurrentDateFormattedSelected(0, response.data.result.from)}, 8:00am - 12:00pm`;
        } else {
          this.arrives_from = this.getCurrentDateFormattedPostMorningAfter(0, true, response.data.result.from);
          this.arrives_to = this.getCurrentDateFormattedPostMorningAfter(0, false, response.data.result.to);
          this.selectDateOfReceiveOption.label = `${this.localization.localize("basket.storePickup.arrives", "ecommerce")} ${this.getCurrentDateFormattedSelected(0, response.data.result.from)}, 14:00pm - 17:00pm`;
        }
      }
    });

  }

  selectReceiver() {
    const classModal = this.device === 'mobile' ? '' : 'modal-custom--in-center-medium';
    const modalComponente = this.device === 'mobile' ? OrderReceiverMobileComponent : OrderReceiverDesktopComponent;
    this.dialog.showWithData<"cancel" | any>({
      component: modalComponente,
      componentProps: {
        dataReceiver: this.dataReceiver,
        firsTimeOrderReceiver: this.firsTimeOrderReceiver
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal]
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        this.selectReceiverOption.label = response.data.result.name + ', ' + response.data.result.position;
        this.selectReceiverOption.sublabel = this.localization.localize('basket.storePickup.authorizationItemPlaceholderSublabel', 'ecommerce');
        this.dataReceiver = response.data.result;
        this.nameReceiver = response.data.result.name;
        this.firsTimeOrderReceiver = true
        this.selectReceiverOption.classLabel = 'text--primary';
      }
    });
  }

  deliveryRequirements() {
    const classModal = this.device === 'mobile' ? '' : 'modal-custom--in-center-medium';
    const modalComponente = this.device === 'mobile' ? DeliveryRequirementsMobileComponent : DeliveryRequirementsDesktopComponent;
    this.dialog.showWithData<"cancel" | string>({
      component: modalComponente,
      componentProps: {
        nameRequirement: this.nameRequirement
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal]
    }).then((response) => {
      if (response.data.result !== 'cancel') {
        this.deliveryRequirementsOption.label = response.data.result;
        this.nameRequirement = response.data.result;
        this.deliveryRequirementsOption.classLabel = 'text--primary';
      }
    });
  }

  selectCoupon() {
    const classModal = this.device === 'mobile' ? 'modal-custom--full' : 'modal-custom--in-center-medium';
    const modalComponente = this.device === 'mobile' ? AddCouponMobileComponent : CouponDesktopComponent;
    this.dialog.showWithData<"cancel" | string>({
      component: modalComponente,
      componentProps: {
        coupon: this.coupon
      },
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal]
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { code, discount_amount } = response.data.result;
        if (code && discount_amount) {
          this._basketServiceProxy.getCouponsCalculate(code)
            .subscribe({
              next: (response) => {
                this.summaryDetails[1].data = response.data;
                this.coupon = code;
              },
              error: (err) => {
                this.message.exception(err);
                this.summaryDetails[1].data = '';
                this.coupon = '';
              },
            });
        } else {
          this.summaryDetails[1].data = '0.00';
          this.coupon = '';
        }
      }
    });
  }

  payMethods() {
    const classModal = this.device === 'mobile' ? 'modal-custom--full' : 'modal-custom--in-center-medium';
    this.dialog.showWithData<"cancel" | undefined>({
      component: PaymentMethodsDesktopComponent,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: ['modal-custom', classModal]
    });
  }

  payMethodsModal() {
    this.dialog.showWithData<"cancel" | undefined>({
      component: PaymentMethodsMobileComponent,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
    });
  }

  navigateToPayment() {
    const classModal = this.device === 'mobile' ? '' : 'modal-custom--in-center-medium';
    switch (this.selectedPaymentMethod) {
      case 'Nueva tarjeta':
        this.navigation.forward('/app/ecommerce/basket/new-card-payment');
        break;
      case 'Visa Débito *** 4115':
        this.navigation.forward('/app/ecommerce/basket/saved-card-payment');
        break;
      case 'Depósito o transferencia':
        this.dialog.showWithData<"cancel" | undefined>({
          component: PaymentMethodsComponent,
          componentProps: {
            amount: this.calculateTotal()
          },
          enterAnimation: this.enterAnimation,
          leaveAnimation: this.leaveAnimation,
          cssClass: ['modal-custom', classModal]
        }).then((response: any) => {
          if (response.data.result !== 'cancel') {
            this.confirmOrder();
            this._ordersService.addCounter();
          }
        });
        break;
      case 'Pago efectivo':
        this.navigation.forward('/app/ecommerce/basket/paymentcash');
        break;
      case 'Paypal':
        window.open('https://www.paypal.com/pe/signin');
        break;
      default:
        console.error('Método de pago no válido.');
    }
  }

  selectBilling() {
    const classModal = this.device === 'mobile' ? 'modal-custom--full' : 'modal-custom--in-center-medium';
    if (this.device !== 'mobile') {
      this.dialog.showWithData<"cancel" | undefined>({
        component: AddBillingDesktopComponent,
        cssClass: ['modal-custom', classModal],
        componentProps: {
          payment: true,
          firstTime: this.firsTimeInvoice,
          invoiceSelectedPayment: this.selectedInvoice,
          desktop: true
        },
        enterAnimation: this.enterAnimation,
        leaveAnimation: this.leaveAnimation,
      }).then((response: any) => {
        if (response.data.result !== 'cancel') {
          const { id, business_name, tax_identifier } = response.data.result;
          this.selectedInvoice.id = id;
          this.selectedInvoice.business_name = business_name;
          this.selectedInvoice.tax_identifier = tax_identifier;
          this.firsTimeInvoice = false;
        }
      });
    } else {
      this.navigation.forward("/app/ecommerce/basket/add-billing");
      this.billingService.firstTime = this.firsTimeInvoiceMobile;
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  getCurrentDateFormatted(daysToAdd: number = 0): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    const formattedDate = `${today.getDate()} ${this.getMonthAbbreviation(today.getMonth())}`;
    return formattedDate;
  }

  getCurrentDateFormattedSelected(daysToAdd: number = 0, date: any): string {
    const today = date;
    today.setDate(today.getDate() + daysToAdd);
    const formattedDate = `${today.getDate()} ${this.getMonthAbbreviation(today.getMonth())}`;
    return formattedDate;
  }

  getMonthAbbreviation(month: number): string {
    const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return monthNames[month];
  }

  getCurrentDateFormattedPostMorning(daysToAdd: number = 0, use8AM: boolean = true, date: any): string {
    const today = date;
    today.setDate(today.getDate() + daysToAdd);

    const defaultHour = use8AM ? 8 : 12;
    today.setHours(defaultHour, 0, 0, 0);
    const year = today.getFullYear();
    const month = this.formatTwoDigits(today.getMonth() + 1);
    const day = this.formatTwoDigits(today.getDate());
    const hours = this.formatTwoDigits(today.getHours());
    const minutes = this.formatTwoDigits(today.getMinutes());
    const seconds = this.formatTwoDigits(today.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getCurrentDateFormattedPostMorningAfter(daysToAdd: number = 0, use8AM: boolean = true, date: any): string {
    const today = date;
    today.setDate(today.getDate() + daysToAdd);
    const defaultHour = use8AM ? 14 : 17;
    today.setHours(defaultHour, 0, 0, 0);
    const year = today.getFullYear();
    const month = this.formatTwoDigits(today.getMonth() + 1);
    const day = this.formatTwoDigits(today.getDate());
    const hours = this.formatTwoDigits(today.getHours());
    const minutes = this.formatTwoDigits(today.getMinutes());
    const seconds = this.formatTwoDigits(today.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getCurrentDateFormattedPost(daysToAdd: number = 0, use8AM: boolean = true): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);

    const defaultHour = use8AM ? 8 : 12;
    today.setHours(defaultHour, 0, 0, 0);
    const year = today.getFullYear();
    const month = this.formatTwoDigits(today.getMonth() + 1);
    const day = this.formatTwoDigits(today.getDate());
    const hours = this.formatTwoDigits(today.getHours());
    const minutes = this.formatTwoDigits(today.getMinutes());
    const seconds = this.formatTwoDigits(today.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getCurrentDateFormattedPostShop(daysToAdd: number = 0, use8AM: boolean = true): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);

    const defaultHour = use8AM ? 8 : 12;
    today.setHours(defaultHour, 0, 0, 0);

    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const day = today.getDate();
    const month = monthNames[today.getMonth()];

    return `${day} de ${month}`;
  }

  formatTwoDigits(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  confirmOrder() {
    this.confirmOrderBoolean = true

    let origin = '';
    if (this._platform.is('capacitor')) {
      origin = 'APP';
    } else {
      origin = 'WEB';
    }
    if (this.agencies === undefined || this.agencies === null) {
      this.agencies = { id: 0 };
    }

    if (this.store === undefined || this.store === null) {
      this.store = { id: 0 };
    }
    if (this.dataReceiver === undefined) {
      this.dataReceiver = '';
    }
    let arrives_to = '';
    let arrives_from = '';
    if (this.deliveryType.type === 'DOMICILIO') {
      arrives_to = this.arrives_from;
      arrives_from = this.arrives_to;
    } else {
      arrives_to = this.arrives_to_to_agency;
      arrives_from = this.arrives_from_to_agency;
    }
    // const deliveryData = [
    //   this.deliveryType.type,
    //   this.agencies.code,
    //   this.store.id,
    //   this.selectAddressOption.extra[2].ubigeo,
    //   this.selectAddressOption.address,
    //   this.selectAddressOption.extra,
    //   this.selectAddressOption.postal_code,
    //   arrives_to,
    //   arrives_from,
    //   this.nameReceiver,
    //   this.dataReceiver,
    //   this.nameRequirement,
    //   'TRANSFERENCIA',
    //   this.selectedInvoice.id,
    //   this.coupon
    // ]


    if (this.selectedInvoice.id === 0) this.selectedInvoice.id = null;
    this._basketServiceProxy
      .cartPay(
        this.deliveryType.type,
        this.agencies.code,
        this.store.id,
        this.selectAddressOption.extra[2].ubigeo,
        this.selectAddressOption.address,
        this.selectAddressOption.extra,
        this.selectAddressOption.postal_code,
        arrives_to,
        arrives_from,
        this.nameReceiver,
        this.dataReceiver,
        this.nameRequirement,
        'TRANSFERENCIA',
        this.selectedInvoice.id,
        this.coupon,
        origin).subscribe({
          next: async () => {
            this.confirmOrderBoolean = false
            await this._basketService.getBasket();
            await this.dialog.dismiss('confirm').then(() => {
              const classModal = this.device === 'mobile' ? 'modal-custom--full' : 'modal-custom--in-center-desktop';
              const modalComponente = this.device === 'mobile' ? SuccessPaymentMobileComponent : SuccessPaymentDesktopComponent;
              this.dialog.showWithData({
                component: modalComponente,
                backdropDismiss: false,
                enterAnimation: this.enterAnimation,
                leaveAnimation: this.leaveAnimation,
                cssClass: ['modal-custom', classModal]
              });
            });

          },
          error: (error: ApiException) => { this.message.exception(error); }
        });
  }

  disabledButton(): boolean {
    const { address, extra, postal_code } = this.selectAddressOption;
    if (this.deliveryType.type == 'DOMICILIO') {
      if (address && extra && postal_code && this.selectedPaymentMethod !== '' && this.deliveryAvailable) {
        return false;
      } else {
        return true;
      }
    } else if (this.deliveryType.type == 'AGENCIA') {

      if (address && extra && postal_code && this.agencies != undefined && this.agencies.code != '' && this.selectedPaymentMethod !== '') {
        return false;
      } else {
        return true;
      }
    } else if (this.deliveryType.type == 'TIENDA') {
      if (address && extra && postal_code && this.store != undefined && this.store.id != '' && this.selectedPaymentMethod !== '') {
        return false;
      } else {
        return true;
      }
    }
    return true;

  }

  calculateTotal(): any {
    let total = (this.cartData?.subtotal) + (this.cartData?.total_taxes) + (+this.summaryDetails[0].data) - (+this.summaryDetails[1].data);
    return total.toFixed(2);
  }

  onBackButtonPressed() {
    const { order, path } = this._activatedRoute.snapshot.queryParams;
    if (order === undefined) {
      if (path === undefined) {
        this.navigation.back('/app/ecommerce/basket');
      } else {
        if ((path as string).includes('variants')) {
          this.navigation.back(`/app/ecommerce/home/${path}`);
        } else {
          this.navigation.back('/app/ecommerce/basket');
        }
      }
    } else {
      this.navigation.forward('/app/ecommerce/profile/order-detail', { order: this.orderEdit });
    }

  }

}
