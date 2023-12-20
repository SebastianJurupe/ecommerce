import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { GoogleServiceProxy } from '@shared/proxies/profile/google.proxies';
import { Observable, map, of } from 'rxjs';

@Component({
  templateUrl: 'add-address.component.html',
  styleUrls: ['add-address.component.scss'],
  host: { 'app.add-address': 'true' }
})
export class AddAddressComponent extends ViewComponent {

  private _googleServiceProxy: GoogleServiceProxy;

  addresses$: Observable<any> = of([]);

  constructor(_injector: Injector) {
    super(_injector);
    this._googleServiceProxy = _injector.get(GoogleServiceProxy);
  }

  search(filterValue: string) {
    this.addresses$ = this._googleServiceProxy.getPlacePrediction(filterValue)
      .pipe(map(res => res.predictions));
  }

  selectAddress(address: any) {
    this.dialog.dismiss(address);
  }

  clearInput() {
    this.search('');
  }

  back() {
    this.dialog.dismiss('cancel');
  }
}