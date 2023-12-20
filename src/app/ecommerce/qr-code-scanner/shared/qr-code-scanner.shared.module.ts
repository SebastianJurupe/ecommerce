import { ModuleWithProviders, NgModule } from '@angular/core';
import { QRCodeScannerService } from './services/qr-code-scanner.service';

@NgModule({})
export class QRCodeScannerSharedModule {
    static forRoot(): ModuleWithProviders<QRCodeScannerSharedModule> {
        return {
            ngModule: QRCodeScannerSharedModule,
            providers: [
                QRCodeScannerService
            ]
        };
    }
}