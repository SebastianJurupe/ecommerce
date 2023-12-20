import { Component, Injector, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ScanResult } from '@geor360/barcode-scanner';
import { AppTabService, SearchViewComponent } from '@geor360/core';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { ProductGetAllOutputDataDto, ProductServiceProxy } from '@shared/proxies/home/product.proxie';
import { Subscription } from 'rxjs';
import { QRCodeScannerService } from '../../shared/services/qr-code-scanner.service';


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: [
    'dashboard.component.scss'
  ]
})
export class ScannerDashboardComponent extends SearchViewComponent<number> implements OnInit, OnDestroy, ViewWillEnter, ViewWillLeave {

  private _productServiceProxy: ProductServiceProxy;
  private scannerSubscription!: Subscription;
  private ngZone: NgZone;
  private _toolbar: AppTabService;

  qrScannerService: QRCodeScannerService;
  virtualHeight: number = 0;
  showScannedProduct: boolean = false;
  productScannedResult: ProductGetAllOutputDataDto = new ProductGetAllOutputDataDto();

  // private callback: number = 0;

  constructor(_injector: Injector) {
    super(_injector);
    this.qrScannerService = _injector.get(QRCodeScannerService);
    this.ngZone = _injector.get(NgZone);
    this.debounceTime = 1_000;
    this._toolbar = _injector.get(AppTabService);
    this._productServiceProxy = _injector.get(ProductServiceProxy);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.virtualHeight = Math.trunc(window.screen.height - 145);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ionViewWillEnter(): void {
    this._toolbar.hide();

    this.qrScannerService.startScanner().then((response) => {
      if (!response.hasPermission) {
        this.message.info(
          this.localization.localize('scanner.dashboard.permission.denied', 'ecommerce'),
          this.localization.localize('scanner.notice', 'ecommerce')
        );
        this._toolbar.show();
        this.onBackButtonPressed();
      }

      this.qrScannerService.changeStatusBar();
    });

    this.scannerSubscription?.unsubscribe();
    this.scannerSubscription = this.qrScannerService.onScanned.subscribe({
      next: (scanResult: ScanResult) => this.handleScanResult(scanResult)
    });

  }

  ionViewWillLeave(): void {
    this.scannerSubscription?.unsubscribe();
    this.qrScannerService.stopScanner();
    this.qrScannerService.resetStatusBar();
    this.showScannedProduct = false;
  }

  showGalleryScan(): void {
    this.qrScannerService
      .startGalleryScan()
      .then((scanResult) => {
        if (scanResult.result === 'invalid') {
          this.notify.error(this.localization.localize('scanner.dashboard.gallery.invalid', 'ecommerce'), 5000);
        }

        if (scanResult.result === 'completed') {
          this.handleScanResult(scanResult);
        }
      });
  }

  private handleScanResult(scanResult: ScanResult) {

    this.ngZone.run(async () => {

      if (scanResult.hasContent) {

        const loading = await this.loader.show();

        this._productServiceProxy.getProductByCode(scanResult.content)
          .subscribe({
            next: (response) => {
              loading.dismiss();
              const product = response.data[0];
              if (!product) this.notify.error(this.localization.localize('scanner.dashboard.gallery.invalid', 'ecommerce'), 5000);

              this.productScannedResult = product;

              if (!product.has_variants) {
                this.showScannedProduct = true;
                this.qrScannerService.pauseScanner();
              } else {
                this.qrScannerService.stopScanner();
                const formattedDescription = product.description.replace(/\s+/g, '-');
                this.navigation.forward(`/app/ecommerce/home/detail-product/${product.id}/${formattedDescription}`);
              }
            },
            error: (err) => {
              loading.dismiss();
              console.error(err);
            },
          });
      }
    });
  }

  onProductAdded(wasAdded: boolean) {
    if (!wasAdded) { return; }

    this.showScannedProduct = false;
    this.qrScannerService.resumeScanner();
  }

  // private handleNewSearch(): void {
  //   this.callback += 1;
  //   this.onNewSearch(this.callback);
  // }

  override onSearchExecute(_data: number): void {
    this.qrScannerService.clearLastScan();

    // if (this.items.length > 10)
    //   this.items.splice(9, this.items.length - 1);
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/categories/home');
  }
}
