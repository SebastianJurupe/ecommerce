import { Component, Injector, Input } from '@angular/core';
import { FormBaseComponent } from '../base/form-base.component';
import { ApiException } from '@geor360/core';
import { NationalDivisionModalDesktopComponent } from '../../../address/national-division-modal/desktop/national-division-modal-desktop.component';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'form-desktop.component.html',
  styleUrls: ['form-desktop.component.scss'],
  host: { 'app.form-desktop': 'true' }
})
export class FormDesktopComponent extends FormBaseComponent {

  private _animationModalService: AnimationModalService;

  @Input() id: number = 0;
  @Input() edit: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
  }

  submit() {
    const { business_name, fiscal_address, tax_identifier, is_default } = this.invoicingForm;
    const department_id = this.invoicingForm.department.id;
    const district_id = this.invoicingForm.district.id;
    const province_id = this.invoicingForm.province.id;
    this.isLoading = true;

    if (this.edit && this.id !== null) {
      this.update(+this.id, business_name, tax_identifier, fiscal_address, is_default, department_id, district_id, province_id);
    } else {
      this.register(business_name, tax_identifier, fiscal_address, is_default, department_id, district_id, province_id);
    }
  }

  ionViewWillEnter() {
    this.toolbar.show();

    if (this.edit && this.id !== null) {
      const invoice = this.billingService.getById(+this.id);

      this.invoicingForm = {
        tax_identifier: invoice?.tax_identifier,
        business_name: invoice?.business_name,
        fiscal_address: invoice?.fiscal_address,
        is_default: invoice?.default,
        department: invoice?.department,
        province: invoice?.province,
        district: invoice?.district
      };

      this.addressForm.extra[0] = {
        national_division: 'Departamento',
        value: this.invoicingForm.department.description,
        ubigeo: this.invoicingForm.department.id,
      };
      this.addressForm.extra[1] = {
        national_division: 'Provincia',
        value: this.invoicingForm.province.description,
        ubigeo: this.invoicingForm.province.id,
      };
      this.addressForm.extra[2] = {
        national_division: 'Distrito',
        value: this.invoicingForm.district.description,
        ubigeo: this.invoicingForm.district.id,
      };
    }
  }



  register(business_name: string, fiscal_address: string, tax_identifier: string, is_default: boolean, department_id: string, province_id: string, district_id: string) {
    this.billingServiceProxy.register(
      business_name,
      fiscal_address,
      tax_identifier,
      is_default,
      department_id,
      district_id,
      province_id,
    ).subscribe({
      next: async () => {
        const loaded = await this.billingService.getAll();

        if (loaded) {
          this.isLoading = false;
          this.dialog.dismiss();
        }
      },
      error: (err) => {
        this.isLoading = false;
        throw new Error(err);
      }
    });
  }

  update(id: number, business_name: string, tax_identifier: string, fiscal_address: string, is_default: boolean, department_id: string, province_id: string, district_id: string) {
    this.billingServiceProxy.update(
      id,
      business_name,
      tax_identifier,
      fiscal_address,
      is_default,
      department_id,
      district_id,
      province_id,
    ).subscribe({
      next: async () => {
        const loaded = await this.billingService.getAll();

        if (loaded) {
          this.isLoading = false;
          this.dialog.dismiss();
        }
      },
      error: (err: ApiException) => {
        this.isLoading = false;
        this.message.exception(err);
      }
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
      showBackdrop: false,
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
          this.invoicingForm.department.id = this.addressForm.extra[0].ubigeo;
          this.invoicingForm.province.id = '';
          this.invoicingForm.district.id = '';

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
      showBackdrop: false,
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
          this.invoicingForm.province.id = this.addressForm.extra[1].ubigeo;
          this.invoicingForm.district.id = '';
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
      showBackdrop: false,
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { id, description } = response.data.result;
        this.addressForm.extra[2] = {
          national_division: 'Distrito',
          value: description,
          ubigeo: id,
        };
        this.invoicingForm.district.id = this.addressForm.extra[2].ubigeo;

      }
    });
  }
}