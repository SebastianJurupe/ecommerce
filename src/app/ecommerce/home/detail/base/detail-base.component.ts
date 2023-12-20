import { Component, Injector, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewComponent } from '@geor360/core';
import { ProductServiceProxy } from '@shared/proxies/home/product.proxie';

export interface Especification {
  specification: string;
  value: string;
}

@Component({
  templateUrl: 'detail-base.component.html',
  styleUrls: ['detail-base.component.scss'],
  host: { 'app.detail-base': 'true' }
})
export class DetailBaseComponent extends ViewComponent implements OnInit {


  private _activateRoute: ActivatedRoute;
  private _productServiceProxy: ProductServiceProxy;

  productId: string = '';
  productDescription: string = '';
  isLoading: boolean = false;
  details: WritableSignal<Especification[]> = signal([]);

  constructor(_injector: Injector) {
    super(_injector);
    this._productServiceProxy = _injector.get(ProductServiceProxy);
    this._activateRoute = _injector.get(ActivatedRoute);
  }

  ngOnInit() {
    const { id, description } = this._activateRoute.snapshot.params;
    this.productId = id;
    this.productDescription = description;
    if (id !== null && id !== undefined) { this.getProductDetails(id); }
  }

  getProductDetails(id: number) {
    this.isLoading = true;
    this._productServiceProxy.getProductsDetail(id)
      .subscribe({
        next: (response) => {
          const { has_variants, internal_id, stock, variants } = response.data;
          const fomarttedStock = has_variants ? this.calculateProductWithVariantsStock(variants) : stock;
          const sku = { specification: 'SKU', value: internal_id };
          const stockDetail = { specification: 'Stock', value: `${fomarttedStock} ${response.data.unit_type.description}` };
          const details = [...response.data.specifications, stockDetail, sku];
          this.isLoading = false;
          this.details.set(details);
        },
        error: (error) => {
          this.isLoading = false;
        },
      });
  }

  calculateProductWithVariantsStock(variants: any[]): number {
    return variants.reduce((acc: number, variant: any) => acc + variant.stock, 0);
  }

  onBackButtonPressed() {
    this.navigation.back(`app/ecommerce/home/detail-product/${this.productId}/${this.productDescription}`);
  }

}
