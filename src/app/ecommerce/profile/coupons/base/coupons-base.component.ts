import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { CouponsService } from '../coupons.service';
import { CartGetCouponsAvaliblesOutputDataDto } from '@shared/proxies/basket/basket.proxie.service';



@Component({
  templateUrl: 'coupons-base.component.html',
  styleUrls: ['coupons-base.component.scss'],
  host: { 'app.coupons-base': 'true' }
})
export class CouponsBaseComponent extends ViewComponent implements OnInit {

  private _couponsService: CouponsService

  coupons: CartGetCouponsAvaliblesOutputDataDto[]=[];
  filteredCoupons: any
  emptyCupons: boolean = false
  loading: boolean = true

  constructor(_injector: Injector) {
    super(_injector);
    this._couponsService = _injector.get(CouponsService)
  }

  ngOnInit() {
    this.filteredCoupons = []
    this.loading = true
    this._couponsService.getAll().then(() => {

      this._couponsService.coupons$.subscribe((coupon) => {
        this.coupons = coupon
        this.filteredCoupons = this.coupons.filter((coupon: any) => !coupon.used);
        this.loading = false

        if (this.filteredCoupons.length == 0) {
          this.emptyCupons = true
        }
      });
    })
  }


}