import { NgModule } from '@angular/core';
import { QRCodeScannerRoutingModule } from './qr-code-scanner.routing.module';
import { QRCodeScannerSharedModule } from './shared/qr-code-scanner.shared.module';

@NgModule({
  imports: [
    QRCodeScannerRoutingModule,
    QRCodeScannerSharedModule.forRoot()
  ]
})
export class QRCodeScannerModule { }
