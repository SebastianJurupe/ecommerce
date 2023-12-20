import { Component, Injector, Input, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfigurationService, ViewComponent } from '@geor360/core';
import { ModalCountryComponent } from '@shared/components';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { AddressServiceProxy } from '@shared/proxies/profile/address.proxie';
import { PublicGetCountriesOutputDataDto, PublicServiceProxy } from '@shared/proxies/public/public.proxie';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { MapDesktopComponent } from '../../map';
import { AddressService } from '../../services/address.service';

@Component({
  templateUrl: 'form-address-base.component.html',
  styleUrls: ['form-address-base.component.scss'],
  host: { 'app.form-address-base': 'true' }
})
export class FormAddressBaseComponent extends ViewComponent {

  private _accountServiceProxy: AccountServiceProxy;
  private _activatedRoute: ActivatedRoute;
  private _addressService: AddressService;
  private _addressServiceProxy: AddressServiceProxy;
  private _appConfigurationService: AppConfigurationService;
  private _publicServiceProxy: PublicServiceProxy;

  animationService = inject(AnimationModalService);

  @Input() id: string = '';
  @Input() usedAsModal: boolean = false;

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
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._publicServiceProxy = _injector.get(PublicServiceProxy);
    this.subscribeToPeruvianNationalDivision();
  }

  get popoverClasses(): string[] {
    const screen = this._appConfigurationService.screen();

    switch (screen) {
      case 'desktop':
        return ['modal-custom', 'modal-custom--in-center-medium'];
      case 'tablet':
        return ['modal-custom', 'modal-custom--in-center-medium'];
      case 'mobile':
        return ['modal-custom', 'modal-custom--full'];
    }
  }

  ionViewWillEnter() {
    const { id } = this._activatedRoute.snapshot.queryParams;
    let formattedId = id === undefined ? this.id : id;

    if (formattedId) { this.getDataToUpdate(formattedId); this.edit = true; } else { this.edit = false; }

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
      showBackdrop: false,
      backdropDismiss: this._appConfigurationService.screen() === 'mobile',
      cssClass: this.popoverClasses
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



  showMap() {
    this._appConfigurationService.screen() === 'mobile'
      ? this.navigation.forward('/app/ecommerce/profile/map')
      : this.openModalMap();
  }

  openModalMap() {
    this.dialog.showWithData<string>({
      component: MapDesktopComponent,
      backdropDismiss: false,
      enterAnimation: this.animationService.openDesktopModal,
      leaveAnimation: this.animationService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      showBackdrop: false,
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
          this.handleSuccessSubmit();
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

    this.isLoading = true;
    this._addressServiceProxy.update(
      formattedId,
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
          this.handleSuccessSubmit();
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

  handleSuccessSubmit() {
    const screen = this._appConfigurationService.screen();

    if (screen === 'mobile') {
      this.navigation.back('/app/ecommerce/profile/address-list');
    } else {
      this.dialog.dismiss();
    }

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
}