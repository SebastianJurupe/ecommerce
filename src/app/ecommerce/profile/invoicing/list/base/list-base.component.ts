import { Component, Injector, OnInit } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { BillingService, Invoice } from '../../invoicing.service';

@Component({
  templateUrl: 'list-base.component.html',
  styleUrls: ['list-base.component.scss'],
  host: { 'app.list-base': 'true' }
})
export class ListBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  billingService: BillingService;
  invoicings: Invoice[] = [];
  toolbar: AppTabService;
  emptyInvoice: boolean = false
  loading: boolean = true
  constructor(_injector: Injector) {
    super(_injector);
    this.billingService = _injector.get(BillingService);
    this.toolbar = _injector.get(AppTabService);
  }

  ngOnInit() {
    this.loading = true
    this.billingService.getAll().then(() => {

      this.billingService.invoices$.subscribe((res) => {
        this.invoicings = res
        this.loading = false

        if (this.invoicings.length == 0) {
          this.emptyInvoice = true
        }
      })
    })
  }

  ionViewWillEnter() {
    this.toolbar.hide();
  }
}