import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { IonRadioGroup } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BillingService, Invoice } from 'src/app/ecommerce/profile/invoicing/invoicing.service';

interface SelectedBilling {
  id: number;
  business_name: string;
  tax_identifier: string;
}

@Component({
  templateUrl: 'add-billing-base.component.html',
  styleUrls: ['add-billing-base.component.scss'],
  host: { 'app.add-billing-base': 'true' }
})
export class AddBillingBaseComponent extends ViewComponent implements OnInit {

  invoicesSubscription: Subscription = new Subscription();

  @Input() invoiceSelectedPayment: any
  @Input() firstTime: any
  @Input() desktop: boolean = false

  @ViewChild('radioGroup') radioGroup!: IonRadioGroup;

  _toolbar: AppTabService;
  billingService: BillingService;
  emptyInvoice: boolean = false
  invoices: Invoice[] = [];
  selectedBilling: SelectedBilling = {
    id: 0,
    business_name: '',
    tax_identifier: '',
  };

  constructor(_injector: Injector) {
    super(_injector);
    this.billingService = _injector.get(BillingService);
    this._toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    this.invoicesSubscription = this.billingService.invoices$.subscribe({
      next: (res) => {
        this.invoices = res;
        if (res.length === 0) {
          this.emptyInvoice = true
        }
        if (this.desktop) {
          if (!this.firstTime) {
            this.selectedBilling = this.invoiceSelectedPayment;
          } else {
            this.setDefault();
          }
        } else {
          if (!this.billingService.firstTime) {
            this.billingService.selectedStorePickupInvoice$
              .subscribe((selectedStorePickupInvoice) => {
                this.selectedBilling = selectedStorePickupInvoice;
              })
          } else {
            this.setDefault();
          }
        }
      },
      error: (err) => {
        throw new Error(err);
      }
    });
  }

  setDefault() {
    this.billingService.selectedStorePickupInvoice$
      .subscribe({
        next: (res) => {
          if (res.id !== 0) {
            this.selectedBilling = res;
          } else {
            const defaultInvoice = this.invoices.find((invoice) => invoice.default === true);

            if (defaultInvoice) {
              this.selectedBilling = {
                id: defaultInvoice.id,
                business_name: defaultInvoice.business_name,
                tax_identifier: defaultInvoice.tax_identifier,
              };
            }
          }
        },
        error: (err) => { throw new Error(err); }
      });
  }

  selectRadio(invoice: Invoice) {
    const { id, business_name, tax_identifier } = invoice;
    if (invoice.id === this.selectedBilling.id) {
      this.selectedBilling = {
        id: 0,
        business_name: '',
        tax_identifier: ''
      }

    } else {

      this.selectedBilling = { id, business_name, tax_identifier };
    }


  }

  selectCheckbox(event: CustomEvent, invoice: Invoice) {
    if (event.detail.checked) {
      // Checkbox seleccionado
      this.selectedBilling = invoice;
    } else {
      // Checkbox deseleccionado
      this.selectedBilling = { id: 0, business_name: '', tax_identifier: '' };
    }

  }
}