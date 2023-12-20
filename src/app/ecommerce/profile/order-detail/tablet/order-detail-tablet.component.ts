import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter } from '@ionic/angular';
import { OptionsOrderPopoverComponent } from '../options-order-popover/options-order-popover.component';
import { DeleteOrderComponent } from '../../modals/delete-order/delete-order.component';
import { agency, delivered, home, onTheWay, pendingPayment, preparation, shop } from '../data';
import { BillingInfoPopoverComponent } from '../billing-info-popover/billing-info-popover.component';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-order-detail-tablet',
  templateUrl: 'order-detail-tablet.component.html',
  styleUrls: ['order-detail-tablet.component.scss'],
  host: { 'app.order-detail-tablet': 'true' }
})
export class OrderDetailTabletComponent extends ViewComponent implements ViewWillEnter, OnInit {

  private _popoverController: PopoverController;
  private _activatedRoute: ActivatedRoute;
  private _configuration: AppConfigurationService;

  products = [
    {
      "name": "Plancha de bicarbonato pulverizad zado lorem ipsum",
      "variants": [
        { "details": "mostaza lorem, 120x150 cm, 25 mm", "price": 9780.00, "amount": 25 }
      ],
    },
    {
      "name": "Plancha de bicarbonato pulverizad zado lorem ipsum",
      "variants": [
        { "details": "mostaza lorem, 120x150 cm, 25 mm", "price": 9780.00, "amount": 25 },
        { "details": "mostaza lorem, 120x150 cm, 25 mm", "price": 9780.00, "amount": 25 },
        { "details": "mostaza lorem, 120x150 cm, 25 mm", "price": 9780.00, "amount": 25 },
      ],
    }
  ];

  listaDesplegada = true;
  device: string;
  order: any = {
    typeOfShipment: 'Envío express',
    address: 'Jr. Samaritanos 879 Miraflores, Lima, Lima, Perú',
    date: 'Llega el 26 dic, 8:00am - 9:00am',
    receiver: 'Wilfredo López, Jefe de logística',
    delivery: 'Traer la factura impresa, guia de remisión, SCTR, SOAT',
    deliveryType: undefined,
    status: undefined,
    billing: {
      name: 'La Samaritana Peruana INC.',
      fiscalNumber: '20475254101'
    }
  };

  deliveryType: any;
  status: any;

  typeOfShipment = {
    classIconButton: 'icon icon--ray icon--14 icon--shape',
    label: this.order?.typeOfShipment,
    method: () => { }
  };

  selectAddressOption = {
    classIconButton: 'icon icon--location',
    label: this.order?.address,
    method: () => { }
  };

  selectDateOfReceiveOption = {
    classIconButton: 'icon icon--calendar',
    label: this.order?.date,
    method: () => { }
  };

  selectReceiverOption = {
    classIconButton: 'icon icon--profile',
    label: this.order?.receiver,
    sublabel: 'Recibirá el pedido',
    method: () => { }
  };

  deliveryRequirementsOption = {
    classIconButton: 'icon icon--paper-negative',
    label: this.order?.delivery,
    method: () => { }
  };

  summaryDetails = [
    {
      label: this.localization.localize('basket.storePickup.priceBoxTitle', 'ecommerce'),
      data: 'S/ 9,999.00'
    },
    {
      label: this.localization.localize('basket.storePickup.deliveryBoxTitle', 'ecommerce'),
      data: 'S/ 45.90'
    },
    {
      label: this.localization.localize('basket.storePickup.couponBoxTitle', 'ecommerce'),
      data: '-S/ 180.00'
    },
    {
      label: this.localization.localize('basket.storePickup.totalBoxTitle', 'ecommerce'),
      data: 'S/ 12,589.00'
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ionViewWillEnter() {
    this.setInformtionDeliveryType();
  }

  ngOnInit() {
    this.setInformtionDeliveryType();
  }

  setInformtionDeliveryType() {
    const { order } = this._activatedRoute.snapshot.queryParams;
    const deliveryType = JSON.parse(order)[0].deliveryType;
    const status = JSON.parse(order)[0].status.class;

    if (deliveryType === 'home') {
      this.deliveryType = home.deliveryType;
    }
    if (deliveryType === 'shop') {
      this.deliveryType = shop.deliveryType;
    }
    if (deliveryType === 'agency') {
      this.deliveryType = agency.deliveryType;
    }

    this.order.deliveryType = deliveryType;

    if (status === 'pending-payment') {
      this.status = pendingPayment.status;
    }
    if (status === 'preparation') {
      this.status = preparation.status;
    }
    if (status === 'on-the-way') {
      this.status = onTheWay.status;
    }
    if (status === 'delivered') {
      this.status = delivered.status;
    }

    this.order.status = status;
  }

  async openBillingInfoPopover(event: Event) {
    const popover = await this._popoverController.create({
      component: BillingInfoPopoverComponent,
      event: event,
      arrow: false,
      side: 'top',
      cssClass: ['billing-info-popover']
    });

    await popover.present();
  }

  toggleListaDesplegable() {
    this.listaDesplegada = !this.listaDesplegada;
  }

  back() {
  }

  async optionsPopover(event: Event) {
    const popover = await this._popoverController.create({
      component: OptionsOrderPopoverComponent,
      event: event,
      alignment: 'end',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        status: this.status
      },
      cssClass: ['invoice-popover']
    });

    await popover.present();

    const res = await popover.onDidDismiss();
    if (res.data === 'edit') {
      this.navigation.forward('/app/ecommerce/basket/store-pickup', { order: JSON.stringify(this.order) });
    } if (res.data === 'delete') {
      this.handleDelete();
    } if (res.data === 'share') {
      await Share.share({
        title: 'See cool stuff',
        text: 'Really awesome thing you need to see right meow',
        url: 'https://geor.app/',
        dialogTitle: '',
      });
    }
  }

  handleDelete() {
    this.dialog.showWithData({
      component: DeleteOrderComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-90']
    }).then(async (res) => {
      if (res.data.result !== 'cancel') {
        this.navigation.back('/app/ecommerce/profile/orders');
        this.notify.success('Pedido eliminado correctamente', 2500);
      }
    });
  }
}
