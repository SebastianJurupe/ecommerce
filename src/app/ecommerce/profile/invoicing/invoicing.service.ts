import { Injectable, Injector } from '@angular/core';
import { BillingServiceProxy } from '@shared/proxies/profile/billing.proxie';
import { BehaviorSubject } from 'rxjs';

export interface Invoice {
  id: number;
  business_name: string;
  tax_identifier: string;
  fiscal_address: string;
  default: boolean;
  department: {
    id: string,
    description: string
  },
  province: {
    id: string,
    description: string
  },
  district: {
    id: string,
    description: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private _billingServiceProxy: BillingServiceProxy;

  invoices$: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  selectedStorePickupInvoice$: BehaviorSubject<{ id: number, business_name: string; tax_identifier: string; }> = new BehaviorSubject<{ id: number, business_name: string, tax_identifier: string; }>({ id: 0, business_name: '', tax_identifier: '' });
  isLoading: boolean = false;
  firstTime: boolean = true
  constructor(_injector: Injector) {
    this._billingServiceProxy = _injector.get(BillingServiceProxy);
  }

  getAll(): Promise<boolean> {
    this.isLoading = true;
    return new Promise<boolean>((resolve, reject) => {
      this._billingServiceProxy.getAll()
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.invoices$.next(res.data);
            resolve(true);
          },
          error: (err) => {
            this.isLoading = false;
            reject(false);
            throw new Error(err);
          },
        });
    });
  }

  getById(id: number) {
    const invoices = this.invoices$.getValue();

    const invoice = invoices.filter((invoice) => invoice.id === id)[0];
    return invoice;
  }

  deleteById(id: number): Promise<boolean> {

    const invoices = this.invoices$.getValue();
    const filteredInvoices = invoices.filter((invoice) => invoice.id !== id);
    this.invoices$.next(filteredInvoices);

    return new Promise<boolean>((resolve, reject) => {
      this._billingServiceProxy.delete(id)
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: (err) => {
            reject(false);
            throw new Error(err);
          }
        });
    });
  }

  setStorePickupInvoice(invoice: { id: number, business_name: string, tax_identifier: string; }) {
    this.selectedStorePickupInvoice$.next(invoice);
  }
}
