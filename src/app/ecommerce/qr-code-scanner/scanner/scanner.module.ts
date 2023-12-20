import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@geor360/core';
import { IonicModule } from '@ionic/angular';
import { ScannerDashboardComponent } from './dashboard/dashboard.component';
import { ScanResultItemComponent } from './dashboard/scan-result-item/scan-result-item.component';
import { ScannerRoutingModule } from './scanner.routing.module';
import { ScannedProductComponent } from './dashboard/scanned-product/scanned-product.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CoreModule,
    ScannerRoutingModule,
  ],
  declarations: [
    ScannerDashboardComponent,
    ScanResultItemComponent,
    ScannedProductComponent
  ]
})
export class ScannerModule { }