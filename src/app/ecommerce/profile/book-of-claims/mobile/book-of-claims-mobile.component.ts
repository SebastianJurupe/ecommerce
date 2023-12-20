import { Component, Injector } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter } from '@ionic/angular';
import { DocumentTypesPopoverComponent } from '@shared/components';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';

@Component({
  templateUrl: 'book-of-claims-mobile.component.html',
  styleUrls: ['book-of-claims-mobile.component.scss'],
  host: { 'app.book-of-claims-mobile': 'true' }
})
export class BookOfClaimsMobileComponent extends ViewComponent implements ViewWillEnter {

  private _popoverController: PopoverController;
  private _profileServiceProxy: ProfileServiceProxy;
  private _toolbar: AppTabService;

  registeredClaim: boolean = false;
  claim = {
    full_name: '',
    document: {
      type: {
        prefix: 'DNI',
        id: '01',
      },
      document_number: '',
    },
    email: '',
    phone: '',
    address: '',
    department: '',
    province: '',
    district: '',
    description: ''
  };
  isLoading: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
    this._toolbar = _injector.get(AppTabService);
  }

  ionViewWillEnter() {
    this._toolbar.hide();
  }

  async openDocumentTypesPopover(event: Event) {
    const popover = await this._popoverController.create({
      component: DocumentTypesPopoverComponent,
      event: event,
      alignment: 'center',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        documentTypeId: this.claim.document.type.id
      },
      cssClass: ['document-types-popover']
    });

    await popover.present();

    const res = await popover.onDidDismiss();

    if (res.data) {
      const { id, name } = res.data;
      this.claim.document.type = {
        id: id,
        prefix: name
      };
    }

  }

  handleDocumentNumber(documentNumber: string) {
    this.claim.document.document_number = documentNumber;
  }

  sendClaim() {
    const { full_name, document: { type: { prefix }, document_number }, email, phone, address, department, province, district, description } = this.claim;
    
    this.isLoading = true;
    this._profileServiceProxy.registerClaim(
      full_name,
      prefix,
      document_number,
      email,
      phone,
      address,
      department,
      province,
      district,
      description
    ).subscribe({
      next: (_response) => {
        this.isLoading = false;
        this.registeredClaim = true;
      },
      error: (_error) => {
        this.isLoading = false;
      }
    });
  }

  handleButtonDisabled() {
    return (
      this.claim.full_name === '' ||
      this.claim.document.document_number === '' ||
      this.claim.email === '' ||
      this.claim.phone === '' ||
      this.claim.address === '' ||
      this.claim.department === '' ||
      this.claim.province === '' ||
      this.claim.district === '' ||
      this.claim.description === '' ||
      this.claim.email.indexOf('@') === -1 ||
      this.isLoading
    );
  }

  back() {
    this.navigation.back('/app/ecommerce/profile/help');
  }
}