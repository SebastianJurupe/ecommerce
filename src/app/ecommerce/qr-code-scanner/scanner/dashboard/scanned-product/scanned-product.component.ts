import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { IonInput } from '@ionic/angular';
import { BasketServiceProxy } from '@shared/proxies/basket/basket.proxie.service';
import { ProductGetAllOutputDataDto } from '@shared/proxies/home/product.proxie';
import { BasketService } from '@shared/services/basket.service';

@Component({
  selector: 'app-scanned-product',
  templateUrl: 'scanned-product.component.html',
  styleUrls: ['scanned-product.component.scss'],
  host: { 'app-scanned-product': 'true' }
})
export class ScannedProductComponent extends ViewComponent implements OnInit {

  private _basketServiceProxy: BasketServiceProxy;
  private _basketService: BasketService;

  @ViewChild('input') input!: IonInput;

  @Input() product: ProductGetAllOutputDataDto = {
    id: 0,
    barcode: '',
    currency: {
      id: '',
      description: '',
      symbol: ''
    },
    description: '',
    files: [],
    has_variants: false,
    in_offer: false,
    internal_id: '',
    offer_price: 0,
    price: 0,
    prices: [],
    unit_type: {
      id: '',
      description: ''
    },
    variants: [],
    stock: 0
  };

  @Output() onProductAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  quantity: number | null = 0;
  isLoading: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._basketServiceProxy = _injector.get(BasketServiceProxy);
    this._basketService = _injector.get(BasketService);
  }

  ngOnInit() {
    this.quantity = null;
    setTimeout(() => this.input.setFocus(), 700);
  }

  addToCard() {
    if ((this.quantity as number) > this.product.stock) {
      const message = this.localization.localize('general.insufficientStock', 'ecommerce');
      return this.notify.error(message, 2500);
    }

    this.isLoading = true;
    this._basketServiceProxy.cartAddProduct(this.product.id, (this.quantity as number))
      .subscribe({
        next: () => {
          this.onProductAdded.emit(true);
          this.isLoading = false;
          this.quantity = null;
          this._basketService.getBasket();
        },
        error: (err) => {
          this.isLoading = false;
          this.onProductAdded.emit(false);
          this.message.exception(err);
        },
      });
    return;
  }

  handleInputWidth(): number {
    const length = this.quantity !== null && this.quantity.toString().length;
    if (length === 1) {
      return 24;
    }
    return ((length as number) * 6) + 24;
  }
}
