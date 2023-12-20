import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfigurationService, ViewComponent } from '@geor360/core';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent extends ViewComponent {
  value = "Empresa.";
  inputValue = "";
  amount = 20;
  valueBasket = 20;
  emailForm: FormGroup;
  buttonToggle: boolean = false;
  index_toggle: number = 0;
  showMenuInput: boolean = false;
  showCartShopping: boolean = true;
  showInputCartShopping: boolean = false;
  indexCardProductNow: number = -1;
  onFocusCardProduct: boolean = false;
  onBlurCardProduct: boolean = false;
  device: string;
  phone: number = 1234567890;
  phoneString = "23423423423";



  myphoneSs: string = "234234234";


  private _configuration: AppConfigurationService;

  productsAux = [
    {
      "price": 2.50, "amount": 0, "details": [
        "Acrílico rugoso de pol itileno rugoso 1",
      ], "tootgle": false,
    },
    {
      "price": 2.50, "amount": 25, "details": [
        "Acrílico rugoso de pol itileno rugoso2",
      ], "tootgle": false
    },
    {
      "price": 2.50, "amount": 25, "details": [
        "Acrílico rugoso de pol itileno rugoso 2",
      ], "tootgle": false
    },
    {
      "price": 2.50, "amount": 2, "details": [
        "Acrílico rugoso de pol itileno rugoso 3 ",
      ], "tootgle": false
    },
    {
      "price": 2.50, "amount": 2, "details": [
        "Acrílico rugoso de pol itileno rugoso 4"
      ], "tootgle": false
    }
  ];
  products = [
    { "details": "My firs product", "amount": 0, "price": 2.50 },
    { "details": "My second producr", "amount": 25, "price": 2.50 },
    { "details": "hi 3", "amount": 25, "price": 2.50 },
    { "details": "hi 4", "amount": 25, "price": 2.50 },
    { "details": "hi 5", "amount": 25, "price": 2.50 }
  ];

  companies = [
    { name: "La Samaritana Corporation S.A.C", ruc: "20713995789", value: "custom-checked" },
    { name: "Negocios del Carmen Portocarreo - NCM Comercial", ruc: "20723995789", value: "custom2" },
    { name: "Norman Osword Sánchez", ruc: "27421234", value: "custom3" }
  ];
  // breaks ={
  //   0: {
  //     slidesOffsetBefore : 50
  //   },
  //   640: {
  //     slidesOffsetBefore : 60
  //   },
  //   768: {
  //     slidesOffsetBefore : 80
  //   },
  //   1024: {
  //     slidesOffsetBefore : 90
  //   },
  // }

  constructor(_injector: Injector) {
    super(_injector);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();


    this.emailForm = new FormGroup({
      email: new FormControl('sasa', [Validators.required, Validators.email])
    });
  }

  clearInput() {

    this.productsAux[this.indexCardProductNow].amount = 0;

  }

  keypress(_content: any) {
  }

  change(_content: any) {
  }

  input(content: any) {
  }

  inputValueChange(content: any) {
  }

  inputEventf(event: any) {
  }

  keyUp(content: any) {
  }

  click() {
  }

  clickCartShopping(index: number) {
    this.showMenuInput = true;
    this.showInputCartShopping = true;
    this.showCartShopping = false;
  }

  clickInputCartShopping(index: number) {
    this.showMenuInput = true;
  }

  clickOk() {
    this.showMenuInput = false;
  }

  clickReply() {

  }

  clickDelete() {
  }

  clickCancel() {

  }

  clickAll() {
  }

  clickPop(event: Event) {
    this.deliveryDetailsPopover(event);
  }



  close() {
  }

  back() {
  }

  search() {
  }

  clear() {
  }

  submit() {
  }

  fillButtonClick() {
  }

  outlineButtonClick() {
  }

  delete() {
  }

  more() {
  }

  moreEvent(event: any) {
  }


  sendMessage(value: any) {
  }


  clickArrow() {
  }


  clickIconButton() {
  }

  clickIconButtonInput() {
  }

  clickSublabel() {
  }

  indexCardProductSelected(event: any) {
    this.indexCardProductNow = event;
  }

  async openModal() {
    // const modal = await this._modalController.create({
    //   component: HomeComponent,

    //   showBackdrop: true,
    //   //animated : false,
    //   componentProps: {
    //     language: this.localization.currentLanguage,
    //     bar: 'world'
    //   },
    // });
    // modal.onDidDismiss().then((modelData) => {

    // });
    // return await modal.present();
  }

  updateProduct(event: any) {
    this.products = event;
  }

  async deliveryDetailsPopover(_event: Event) {
    // const popover = await this.popoverCtrl.create({
    //   component: DelilveryDetailsComponent,
    //   event: event,
    //   alignment: 'end',
    //   mode: 'ios',
    //   size: 'cover',
    //   arrow: false,
    //   dismissOnSelect: true,
    // })

    // await popover.present();
  }


  focus() {
    this.onFocusCardProduct = true;
  }

  blur() {
    this.onFocusCardProduct = false;
    setTimeout(
      () => {
        if (this.onFocusCardProduct == false) {
          this.showMenuInput = false;
        }
      },
      100
    );
  }

  goToDetails() {
    switch (this.device) {
      case 'mobile':

        break;

      case 'tablet':

        break;

      case 'desktop':

        break;

    }

  }

  menuClick(_event: any) {
  }
  basketClick(_event: any) {
  }
  inboxClick(_event: any) {
  }
  profileClick(_event: any) {
  }

  brandClick(_event: any) {
  }

}
