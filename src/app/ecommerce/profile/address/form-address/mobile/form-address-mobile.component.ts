import { Component, Injector, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppTabService, ViewComponent } from '@geor360/core';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { ModalCountryComponent } from '@shared/components';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { AddressServiceProxy } from '@shared/proxies/profile/address.proxie';
import { PublicGetCountriesOutputDataDto, PublicServiceProxy } from '@shared/proxies/public/public.proxie';
import { MapDesktopComponent } from '../../map';
import { NationalDivisionModalComponent } from '../../national-division-modal/mobile/national-division-modal.component';
import { AddressService } from '../../services/address.service';

@Component({
  templateUrl: 'form-address-mobile.component.html',
  styleUrls: ['form-address-mobile.component.scss'],
  host: { 'app.form-address-mobile': 'true' }
})
export class FormAddressMobileComponent extends ViewComponent implements ViewWillEnter {

  private _accountServiceProxy: AccountServiceProxy;
  private _activatedRoute: ActivatedRoute;
  private _addressService: AddressService;
  private _addressServiceProxy: AddressServiceProxy;
  private _publicServiceProxy: PublicServiceProxy;
  private _toolbar: AppTabService;

  @ViewChild('content') content!: IonContent;

  @Input() usedAsModal: boolean = false;
  @Input() id: string = '';

  showCompleteForm: boolean = false;
  isLoading: boolean = false;
  edit: boolean = false;
  country = {
    id: 'PE',
    description: 'Perú',
    default: true,
    code: '+51',
    mask: '999 999 999',
    flag: 'https://geor-aplicaciones-demo.geor.io/images/pe.svg',
    national_division: [
      'Departamento',
      'Provincia',
      'Distrito',
    ]
  };
  addressForm = {
    description: '',
    country_id: this.country.id,
    address: '',
    extra: [
      { national_division: '', value: '', ubigeo: '', },
      { national_division: '', value: '', ubigeo: '', },
      { national_division: '', value: '', ubigeo: '', },
    ],
    postal_code: '',
    is_default: false,
  };
  nationalDivisionsData = {
    departments: [],
    districts: [],
    provinces: []
  };

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._addressService = _injector.get(AddressService);
    this._addressServiceProxy = _injector.get(AddressServiceProxy);
    this._publicServiceProxy = _injector.get(PublicServiceProxy);
    this._toolbar = _injector.get(AppTabService);
    this.subscribeToPeruvianNationalDivision();
  }

  ionViewWillEnter() {
    const { id } = this._activatedRoute.snapshot.queryParams;
    let formattedId = id === undefined ? this.id : id;

    if (formattedId) { this.getDataToUpdate(formattedId); this.edit = true; } else { this.edit = false; }

    this._toolbar.hide();
    this._addressService.get()
      .subscribe({
        next: (address) => {
          if (address === '') { return; }
          this.addressForm.address = address;
        },
        error: (err) => { throw new Error(err); }
      });
  }

  async getDataToUpdate(id: number) {
    try {
      const { country, default: isDefault, description, extra, postal_code, address } = await this._addressService.getById(id);

      this.addressForm = {
        description,
        country_id: country,
        address: address,
        extra,
        postal_code,
        is_default: isDefault,
      };
      this.getAndFilterCountries();
    } catch (error) {
      this.navigation.back('/app/ecommerce/profile/address-list');
    }
  }


  getAndFilterCountries() {
    this._publicServiceProxy.getCountries()
      .subscribe({
        next: (response) => {
          const countries = response.data;

          this.country = countries.filter((country: PublicGetCountriesOutputDataDto) => country.id === this.addressForm.country_id)[0];
        },
        error: (error) => { console.error(error); }
      });
  }

  handleShowCompleteForm() {
    this.showCompleteForm = this.addressForm.description !== '' || this.addressForm.address !== '';
  }

  openCountriesModal() {
    this.dialog.showWithData<'cancel' | PublicGetCountriesOutputDataDto>({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryId: this.country.id,
      },
      cssClass: ['modal-custom', 'modal-custom--full']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
        this.addressForm.country_id = response.data.result.id;
        if (response.data.result.id === 'PE') { this.subscribeToPeruvianNationalDivision(); }
      }
    });
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
      component: NationalDivisionModalComponent,
      componentProps: {
        data: this.nationalDivisionsData.departments,
        selectedId: this.addressForm.extra[0].ubigeo,
        title: 'Departamento'
      },
      cssClass: ['modal-custom', 'modal-custom--full']
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
      component: NationalDivisionModalComponent,
      componentProps: {
        data: provinces,
        selectedId: this.addressForm.extra[1].ubigeo,
        title: 'Provincia'
      },
      cssClass: ['modal-custom', 'modal-custom--full']
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
      component: NationalDivisionModalComponent,
      componentProps: {
        data: districts,
        selectedId: this.addressForm.extra[2].ubigeo,
        title: 'Distrito'
      },
      cssClass: ['modal-custom', 'modal-custom--full']
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

  showMap() {
    const { id } = this._activatedRoute.snapshot.queryParams;
    this.usedAsModal
      ? this.openModalMap()
      : this.edit
        ? this.navigation.forward('/app/ecommerce/profile/map', { id })
        : this.navigation.forward('/app/ecommerce/profile/map');
  }

  openModalMap() {
    this.dialog.showWithData<string>({
      component: MapDesktopComponent,
      backdropDismiss: false,
      cssClass: ['modal-custom', 'modal-custom--full'],
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        const { address } = response.data.result;
        this.addressForm.address = address;
      }
    });
  }

  submit() {
    if (this.edit) {
      this.update();
    } else {
      this.register();
    }
  }

  register() {
    this.addressForm.extra[0].national_division = this.country.national_division[0];
    this.addressForm.extra[1].national_division = this.country.national_division[1];
    this.addressForm.extra[2].national_division = this.country.national_division[2];

    if (this.addressForm.extra[2].value === '') {
      this.addressForm.extra.pop();
    }

    const { description, country_id, address, extra, postal_code, is_default } = this.addressForm;

    this.isLoading = true;
    this._addressServiceProxy.register(
      description,
      country_id,
      address,
      extra,
      postal_code,
      is_default
    ).subscribe({
      next: async () => {
        const success = await this._addressService.getAll();
        if (success) {
          this.isLoading = false;
          this.resetFormValues();

          this.usedAsModal
            ? this.dialog.dismiss('')
            : this.navigation.forward('/app/ecommerce/profile/address-list');
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  update() {
    const { id } = this._activatedRoute.snapshot.queryParams;

    let formattedId = id === undefined ? this.id : id;

    const { address, country_id, description, extra, is_default, postal_code } = this.addressForm;
    // if (extra[0]) { extra[0].ubigeo = ''; }
    // if (extra[1]) { extra[1].ubigeo = ''; }
    // if (extra[2]) { extra[2].ubigeo = ''; }

    this.isLoading = true;
    this._addressServiceProxy.update(
      formattedId,
      description,
      country_id,
      address, extra,
      postal_code,
      is_default
    ).subscribe({
      next: async (res) => {
        const success = await this._addressService.getAll();
        if (success) {
          this.isLoading = false;
          this.resetFormValues();

          this.usedAsModal
            ? this.dialog.dismiss('')
            : this.navigation.forward('/app/ecommerce/profile/address-list');

          await this.notify.success(res.message, 2500);
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  private resetFormValues() {
    this.addressForm = {
      description: '',
      country_id: this.country.id,
      address: '',
      extra: [
        { national_division: '', value: '', ubigeo: '', },
        { national_division: '', value: '', ubigeo: '', },
        { national_division: '', value: '', ubigeo: '', },
      ],
      postal_code: '',
      is_default: false,
    };
    this._addressService.set('');
  }

  disableSaveButton() {
    return this.addressForm.description === '' ||
      this.addressForm.address === '' ||
      this.addressForm.postal_code === '' ||
      this.addressForm.extra[0].value === '' ||
      this.addressForm.extra[1].value === '' ||
      this.addressForm.description.length >= 20 ||
      this.isLoading;
  }

  handleBack() {
    this.usedAsModal
      ? this.dialog.dismiss('cancel')
      : this.navigation.back('/app/ecommerce/profile/address-list');
    this.resetFormValues();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(500);
    }, 700);
  }
}
