import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppTabService, ViewComponent } from '@geor360/core';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { BillingServiceProxy } from '@shared/proxies/profile/billing.proxie';
import { BillingService } from '../../invoicing.service';

@Component({
  templateUrl: 'form-base.component.html',
  styleUrls: ['form-base.component.scss'],
  host: { 'app.form-base': 'true' }
})
export class FormBaseComponent extends ViewComponent {
  private _accountServiceProxy: AccountServiceProxy;

  activatedRoute: ActivatedRoute;
  billingService: BillingService;
  billingServiceProxy: BillingServiceProxy;
  toolbar: AppTabService;
  invoicingForm = {
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
  isLoading: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this.activatedRoute = _injector.get(ActivatedRoute);
    this.billingService = _injector.get(BillingService);
    this.billingServiceProxy = _injector.get(BillingServiceProxy);
    this.subscribeToPeruvianNationalDivision();
    this.toolbar = _injector.get(AppTabService);
  }

  disableButton() {
    return (
      !this.invoicingForm.business_name ||
      !this.invoicingForm.tax_identifier ||
      !this.invoicingForm.fiscal_address ||
      this.invoicingForm.business_name.length >= 35 ||
      this.isLoading
    );
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
}