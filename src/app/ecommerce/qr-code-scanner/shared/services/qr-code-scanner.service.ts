import { EventEmitter, Injectable, Injector } from "@angular/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { BarcodeScanner, GallerScanResult, ScanResult } from "@geor360/barcode-scanner";
import { AppThemeService } from "@geor360/core";
import { Platform } from "@ionic/angular";

interface IQRCodeScannerStartResult {
  hasPermission: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QRCodeScannerService {

  private platform: Platform;
  private themeService: AppThemeService;

  onScanned: EventEmitter<ScanResult> = new EventEmitter<ScanResult>();
  torchEnabled: boolean = false;
  torchIsPowerOn: boolean = false;

  private lastContent!: string;

  constructor(_injector: Injector) {
    this.platform = _injector.get(Platform);
    this.themeService = _injector.get(AppThemeService);
  }

  changeStatusBar(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.checkIfIsCapacitor()) {
        StatusBar.setStyle({
          style: Style.Dark
        }).then(() => resolve());
      }
    });
  }

  resetStatusBar(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.checkIfIsCapacitor()) {
        StatusBar.setStyle({
          style: this.themeService.theme == 'dark' ?
            Style.Dark :
            Style.Light
        }).then(() => resolve());
      }
    });
  }

  clearLastScan(): Promise<void> {
    return new Promise<void>((resolve) => {
      BarcodeScanner
        .clearLastScan()
        .then(() => resolve())
        .catch(() => resolve());
    });
  }

  startScanner(): Promise<IQRCodeScannerStartResult> {
    return new Promise<IQRCodeScannerStartResult>(async (resolve) => {
      await BarcodeScanner.clearLastScan();
      BarcodeScanner
        .checkPermission({ force: true })
        .then(async (response) => {
          if (response.granted) {
            BarcodeScanner
              .hideBackground()
              .then(() => {

                const body = document.getElementById('body')!;
                body.classList.add('scanner-active');
                body.style.background = 'none';

                if (this.platform.is('capacitor')) {

                  BarcodeScanner.startScanning({}, (scanResult) => {
                    this.onScanned.next(scanResult);
                  });

                  this.torchEnabled = true;

                } else {
                  const scan = () => {
                    BarcodeScanner.startScan({}).then((scanResult) => {
                      if (scanResult.content !== this.lastContent) {
                        this.lastContent = scanResult.content as string;
                        this.onScanned.next(scanResult);
                        setTimeout(() => scan(), 1000);
                      } else {
                        setTimeout(() => scan(), 1000);
                      }
                    });
                  };

                  scan();
                }

                resolve({ hasPermission: true });

              }).catch(() => resolve({ hasPermission: false }));
          } else {
            resolve({ hasPermission: false });
          }
        }).catch(() => resolve({ hasPermission: false }));
    });
  }

  stopScanner(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      BarcodeScanner
        .hideBackground()
        .then(() => {

          document.querySelector('body')!.classList.remove('scanner-active');

          BarcodeScanner
            .stopScan({ resolveScan: false })
            .then(() => resolve())
            .catch(() => resolve());

          this.disableTorch();

        }).catch(() => reject());
    });
  }

  startGalleryScan(): Promise<GallerScanResult> {
    return new Promise<GallerScanResult>((resolve, _reject) => {

      if (this.platform.is('capacitor')) {

        BarcodeScanner.pauseScanning().then(() => {

          BarcodeScanner
            .startGalleryScan({})
            .then((scanResult) => {
              resolve(scanResult);
            }).catch(() => resolve({
              result: 'canceled',
              content: undefined,
              hasContent: false,
              format: undefined
            })).finally(() => BarcodeScanner.resumeScanning());

        });
      } else {

        BarcodeScanner.startGalleryScan({}).then((scanResult) => {

          this.startScanner();
          resolve(scanResult);

        }).catch(() => resolve({
          result: 'canceled',
          content: undefined,
          hasContent: false,
          format: undefined
        }));
      }
    });
  }

  async pauseScanner() {
    await BarcodeScanner.pauseScanning();
  }

  async resumeScanner() {
    await BarcodeScanner.resumeScanning();
  }

  async toggleTorch(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      try {
        await BarcodeScanner.toggleTorch();
        await this.updateTorchStatus();
        resolve();
      } catch (error) {
        resolve();
      }
    });
  }

  async disableTorch(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      try {
        await BarcodeScanner.disableTorch();
        await this.updateTorchStatus();
        resolve();
      } catch (error) {
        resolve();
      }
    });
  }

  private updateTorchStatus(): Promise<void> {
    return new Promise<void>((resolve) => {
      BarcodeScanner
        .getTorchState()
        .then((status) => {
          this.torchIsPowerOn = status.isEnabled;
          resolve();
        }).catch(() => resolve());
    });
  }

  private resetScanner(): Promise<void> {
    return new Promise<void>((resolve) => {
      BarcodeScanner.startScan({}).then((scanResult) => {
        this.onScanned.next(scanResult);
        this.resetScanner();
        resolve();
      });
    });
  }

  private checkIfIsCapacitor(): boolean {
    return this.platform.is('capacitor');
  }
}