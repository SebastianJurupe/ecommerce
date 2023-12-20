import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
@Component({
  templateUrl: 'order-receiver-base.component.html',
  styleUrls: ['order-receiver-base.component.scss'],
  host: { 'app.order-receiver-base': 'true' }
})
export class OrderReceiverBaseComponent extends ViewComponent {
  @Input() dataReceiver: any
  @Input() firsTimeOrderReceiver: boolean = false
  receiverInfoRegistered: boolean = false;
  receiverInfo = {
    name: '',
    document: {
      type: {
        prefix: 'DNI',
        id: '01',
      },
      number: '',
    },
    position: '',
    phone: '',
    email: '',
  };

  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };
  complete: boolean = false
  constructor(_injector: Injector) {
    super(_injector);
  }

  handleInputPhoneEvent(value: string) {
    this.receiverInfo.phone = value;
  }
  ngOnInit() {
    if (this.dataReceiver != undefined) {
      this.receiverInfo = this.dataReceiver
      this.receiverInfo.document.number = this.dataReceiver.document.number
      this.complete = this.firsTimeOrderReceiver
    }
  }
  disableButton() {
    const isFullNameValid = /^[a-zA-Z\s]+$/.test(this.receiverInfo.name);

    const isPositionValid = /^[a-zA-Z\s]+$/.test(this.receiverInfo.position);

    const isEmailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.receiverInfo.email);

    const isPhoneValid = this.receiverInfo.phone.trim() !== '';

    return !isFullNameValid || !isPositionValid || !isEmailValid || !isPhoneValid;
  }

  save() {
    this.dialog.dismiss(this.receiverInfo);
  }

  close() {
    this.dialog.dismiss('cancel');
  }

  handleDocumentNumber(documentNumber: string) {
    this.receiverInfo.document.number = documentNumber;
  }

  validate(): boolean {
    if (this.receiverInfo.name !== '' && this.receiverInfo.document.number !== '' && this.receiverInfo.position != '' && this.receiverInfo.email != '' && this.complete) {
      return false
    }
    return true
  }

  handleInputComplete(event: any) {
    this.complete = event
  }
}