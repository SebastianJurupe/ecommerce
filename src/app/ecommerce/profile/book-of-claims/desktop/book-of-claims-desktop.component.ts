import { Component, Injector } from '@angular/core';
import { BookOfClaimsBaseComponent } from '../base/book-of-claims-base.component';
import { DocumentTypesPopoverComponent } from '@shared/components';
import { PopoverController } from '@ionic/angular';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { NationalDivisionModalDesktopComponent } from '../../address/national-division-modal';
import { ProfileServiceProxy } from '@shared/proxies/profile/profile.proxies';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'book-of-claims-desktop.component.html',
  styleUrls: ['book-of-claims-desktop.component.scss'],
  host: { 'app.book-of-claims-desktop': 'true' }
})
export class BookOfClaimsDesktopComponent extends BookOfClaimsBaseComponent {

  private _animationModalService: AnimationModalService;
  private _popoverController: PopoverController;
  private _accountServiceProxy: AccountServiceProxy;
  private _profileServiceProxy: ProfileServiceProxy;

  addressForm = {
    extra: [
      { national_division: '', value: '', ubigeo: '', },
      { national_division: '', value: '', ubigeo: '', },
      { national_division: '', value: '', ubigeo: '', },
    ],

  };
  country = {
    national_division: [
      this.localization.localize("profile.bookOfClaims.department", "ecommerce"),
      this.localization.localize("profile.bookOfClaims.province", "ecommerce"),
      this.localization.localize("profile.bookOfClaims.district", "ecommerce")
    ]
  };
  nationalDivisionsData = {
    departments: [],
    districts: [],
    provinces: []
  };

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this._popoverController = _injector.get(PopoverController);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this._profileServiceProxy = _injector.get(ProfileServiceProxy);
    this.subscribeToPeruvianNationalDivision();
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
      cssClass: ['document-types-popover-desktop']
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

  subscribeToPeruvianNationalDivision() {
    this._accountServiceProxy.getUbigeo()
      .subscribe({
        next: (response) => {
          this.nationalDivisionsData = response.data;
        },
        error: (error) => { console.error(error); }
      });
  }

  openDepartmentsModal() {
    if (this.nationalDivisionsData.departments.length === 0) { return; }

    this.dialog.showWithData<'cancel' | any>({
      component: NationalDivisionModalDesktopComponent,
      componentProps: {
        data: this.nationalDivisionsData.departments,
        selectedId: this.addressForm.extra[0].ubigeo,
        title: this.localization.localize("profile.bookOfClaims.departments", "ecommerce")
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { id, description } = response.data.result;
        if (this.addressForm.extra[0].value != description) {
          this.addressForm.extra[0] = {
            national_division: 'Departamento',
            value: description,
            ubigeo: id,
          };
          this.addressForm.extra[1] = {
            national_division: 'Provincia',
            value: '',
            ubigeo: '',
          };
          this.addressForm.extra[2] = {
            national_division: 'Distrito',
            value: '',
            ubigeo: '',
          };
          this.claim.department = this.addressForm.extra[0].value;
          this.claim.province = '';
          this.claim.district = '';

        }
      }
    });
  }

  openProvincesModal() {
    if (this.addressForm.extra[0].ubigeo === '') { return; }
    const provinces = this.nationalDivisionsData.provinces.filter((province: any) => this.addressForm.extra[0].ubigeo === province.department_id);
    this.dialog.showWithData<'cancel' | any>({
      component: NationalDivisionModalDesktopComponent,
      componentProps: {
        data: provinces,
        selectedId: this.addressForm.extra[1].ubigeo,
        title: this.localization.localize("profile.bookOfClaims.provinces", "ecommerce")
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { id, description } = response.data.result;
        if (this.addressForm.extra[0].value != description) {
          this.addressForm.extra[1] = {
            national_division: 'Provincia',
            value: description,
            ubigeo: id,
          };
          this.addressForm.extra[2] = {
            national_division: 'Distrito',
            value: '',
            ubigeo: '',
          };
          this.claim.province = this.addressForm.extra[1].value;
          this.claim.district = '';
        }
      }
    });
  }

  openDistrictsModal() {
    if (this.addressForm.extra[1].ubigeo === '') { return; }

    const districts = this.nationalDivisionsData.districts.filter((district: any) => this.addressForm.extra[1].ubigeo === district.province_id);
    this.dialog.showWithData<'cancel' | any>({
      component: NationalDivisionModalDesktopComponent,
      componentProps: {
        data: districts,
        selectedId: this.addressForm.extra[2].ubigeo,
        title: this.localization.localize("profile.bookOfClaims.districts", "ecommerce")
      },
      enterAnimation: this._animationModalService.openDesktopModal,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { id, description } = response.data.result;
        this.addressForm.extra[2] = {
          national_division: 'Distrito',
          value: description,
          ubigeo: id,
        };
        this.claim.district = this.addressForm.extra[2].value;
      }
    });
  }

  handleDocumentNumber(documentNumber: string) {
    this.claim.document.document_number = documentNumber;
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

  goEmail() {
    window.open("mailto:reclamos@renac.pe", "_blank");
  }
}