import { Component, Injector } from '@angular/core';
import { ApiException } from '@geor360/core';
import { FormBaseComponent } from '../base/form-base.component';
import { NationalDivisionModalComponent } from '../../../address/national-division-modal/mobile/national-division-modal.component';

@Component({
  templateUrl: 'form-mobile.component.html',
  styleUrls: ['form-mobile.component.scss'],
  host: { 'app.form-mobile': 'true' }
})
export class FormMobileComponent extends FormBaseComponent {


  constructor(_injector: Injector) {
    super(_injector);
  }
  submit() {
    const { path, id } = this.activatedRoute.snapshot.queryParams;
    const { business_name, fiscal_address, tax_identifier, is_default } = this.invoicingForm;
    const department_id = this.invoicingForm.department.id;
    const district_id = this.invoicingForm.district.id;
    const province_id = this.invoicingForm.province.id;
    this.isLoading = true;

    if (path === 'edit' || path === 'edit-billing-basket' && id !== null) {
      this.update(+id, business_name, tax_identifier, fiscal_address, is_default, department_id, district_id, province_id);
    } else {
      this.register(business_name, tax_identifier, fiscal_address, is_default, department_id, district_id, province_id);
    }
  }

  ionViewWillEnter() {
    this.toolbar.hide();

    const { path, id } = this.activatedRoute.snapshot.queryParams;

    if (path === 'edit' || path === 'edit-billing-basket' && id !== null) {
      const invoice = this.billingService.getById(+id);

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
    } else {
      this.invoicingForm = {
        business_name: '',
        tax_identifier: '',
        fiscal_address: '',
        is_default: false,
        department: {
          id: '',
          description: ''
        },
        province: {
          id: '',
          description: ''
        },
        district: {
          id: '',
          description: ''
        }
      };
      this.addressForm = {
        extra: [
          { national_division: '', value: '', ubigeo: '', },
          { national_division: '', value: '', ubigeo: '', },
          { national_division: '', value: '', ubigeo: '', },
        ],

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
          this.back();
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
          this.back();
        }
      },
      error: (err: ApiException) => {
        this.isLoading = false;
        this.message.exception(err);
      }
    });
  }
  back() {
    const { path } = this.activatedRoute.snapshot.queryParams;
    switch (path) {
      case 'invoicing-list':
        this.navigation.back('/app/ecommerce/profile/invoicing-list');
        break;
      case 'edit':
        this.navigation.back('/app/ecommerce/profile/invoicing-list');
        break;
      case 'add-billing':
        this.navigation.back(`/app/ecommerce/basket/add-billing`);
        break;
      case 'edit-billing-basket':
        this.navigation.back(`/app/ecommerce/basket/add-billing`);
        break;
    }
  }

  openDepartmentsModal() {

    if (this.nationalDivisionsData.departments.length === 0) { return; }
    this.dialog.showWithData<'cancel' | any>({
      component: NationalDivisionModalComponent,
      componentProps: {
        data: this.nationalDivisionsData.departments,
        selectedId: this.addressForm.extra[0].ubigeo,
        title: this.localization.localize("profile.bookOfClaims.departments", "ecommerce")
      },
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
      component: NationalDivisionModalComponent,
      componentProps: {
        data: provinces,
        selectedId: this.addressForm.extra[1].ubigeo,
        title: this.localization.localize("profile.bookOfClaims.provinces", "ecommerce")
      },
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
      component: NationalDivisionModalComponent,
      componentProps: {
        data: districts,
        selectedId: this.addressForm.extra[2].ubigeo,
        title: this.localization.localize("profile.bookOfClaims.districts", "ecommerce")
      },
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
