import { Component, Injector, Input } from '@angular/core';
import { FormAddressBaseComponent } from '../base/form-address-base.component';
import { NationalDivisionModalDesktopComponent } from '../../national-division-modal';
import { AppTabService } from '@geor360/core';

@Component({
  templateUrl: 'form-address-desktop.component.html',
  styleUrls: ['form-address-desktop.component.scss'],
  host: { 'app.form-address-desktop': 'true' }
})
export class FormAddressDesktopComponent extends FormAddressBaseComponent {

  private _toolbar: AppTabService;

  @Input() detail: boolean = false

  constructor(_injector: Injector) {
    super(_injector);
    this._toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    if (!this.detail) {
      this._toolbar.show();
    }
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
      showBackdrop: false,
      cssClass: this.popoverClasses
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { id, description } = response.data.result;
        this.addressForm.extra[0] = {
          national_division: 'Departamento',
          value: description,
          ubigeo: id,
        };
        if (this.addressForm.extra[1].ubigeo !== '') {
          this.addressForm.extra[1] = { national_division: '', value: '', ubigeo: '', };
        }
        if (this.addressForm.extra[2].ubigeo !== '') {
          this.addressForm.extra[2] = { national_division: '', value: '', ubigeo: '', };
        };
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
      cssClass: this.popoverClasses
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { id, description } = response.data.result;
        this.addressForm.extra[1] = {
          national_division: 'Provincia',
          value: description,
          ubigeo: id,
        };
        if (this.addressForm.extra[2].ubigeo !== '') {
          this.addressForm.extra[2] = { national_division: '', value: '', ubigeo: '', };
        };
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
      cssClass: this.popoverClasses,
      showBackdrop: false,
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { id, description } = response.data.result;
        this.addressForm.extra[2] = {
          national_division: 'Distrito',
          value: description,
          ubigeo: id,
        };
      }
    });
  }
}