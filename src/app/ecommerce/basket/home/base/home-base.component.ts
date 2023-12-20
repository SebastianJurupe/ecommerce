import { Component, Injector, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Keyboard } from '@geor360/capacitor-keyboard';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { Platform } from '@ionic/angular';
import { BasketServiceProxy } from '@shared/proxies/basket/basket.proxie.service';
import { DeleteProductComponent } from '../../modals/delete-product/delete-product.component';
import { BasketService } from '@shared/services/basket.service';

@Component({
  templateUrl: 'home-base.component.html',
  styleUrls: ['home-base.component.scss'],
  host: { 'app.basket.home-base': 'true' }
})
export class HomeBaseComponent extends ViewComponent implements OnInit {

  private _basketServiceProxy: BasketServiceProxy;
  private _basketService: BasketService;
  private _activatedRoute: ActivatedRoute;
  private _ngZone: NgZone;
  private _platform: Platform;
  private _toolbar: AppTabService;

  buttonToggle: boolean = false;
  cartCode: string = '';
  cartData: any;
  cartItems: any[] = [];
  cartItemsBackup: any[] = [];
  cartVariantsInBasket: any[] = [];
  index_toggle: number = 0;
  indexSelected: number = -1;
  isInputFocus: boolean = false;
  isKeyboardOpen: boolean = false;
  isLoading: boolean = false;
  keyboardWillShow: boolean = false;
  positionSelected: number = 0;
  showCartShopping: boolean = true;
  showInputCartShopping: boolean = false;
  showMenu: boolean = false;
  showMenuInput: boolean = false;
  skeletonShowed: boolean = true;
  total: number = 0;
  taxes: number = 0;

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._ngZone = _injector.get(NgZone);
    this._platform = _injector.get(Platform);
    this._toolbar = _injector.get(AppTabService);
    this._basketServiceProxy = _injector.get(BasketServiceProxy);
    this._basketService = _injector.get(BasketService);
  }

  get platform(): string {
    return this._platform.is('ios') ? 'ios' : 'android';
  }

  ngOnInit() {
    this.getCartItems();
    if (this._platform.is('capacitor')) {
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardOpen = true;
      });

      Keyboard.addListener('keyboardDidHide', () => {
        this.isKeyboardOpen = false;
      });
    }
    if (this._platform.is('capacitor')) {
      Keyboard.addListener('keyboardWillShow', () => {
        this._ngZone.run(() => {
          this.keyboardWillShow = true;
        });
      });
      Keyboard.addListener('keyboardWillHide', () => {
        this._ngZone.run(() => {
          this.keyboardWillShow = false;
        });
      });
    };
  }

  getCartItems() {
    this._basketServiceProxy.getCart()
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (!response.data) {
            this.cartItems = []
            this.cartItemsBackup = []
            this.isLoading = false
            this.cartData = []
            return
          };
          this.cartItems = response.data.items;
          this.cartItemsBackup = response.data.items;
          this.cartCode = response.data.code;
          this.cartData = response.data;
          this.total = this.cartItems.reduce((total, object) => {
            return total + object.total;
          }, 0);
          this._basketServiceProxy;
          // setTimeout(() => this.isLoading = false, 500);
          this.skeletonShowed = false;
        },
        error: () => {
          setTimeout(() => this.isLoading = false, 500);
        }
      });
  }

  deleteItem(id: number) {
    this._basketServiceProxy.cartDeleteProduct(this.cartCode, id)
      .subscribe({
        next: () => {
          //this.cartItems = [];
          this.getCartItems();
          this._basketService.getBasket();
          this.isLoading = false;
        },
        error: (error: ApiException) => { this.message.exception(error); }
      });
  }

  ionViewWillEnter() {
    this._toolbar.show();
    this.cartItems = [];
    this.isLoading = true;
    this.getCartItems();
  }

  delivery() {
    //this.navigation.forward('/app/ecommerce/basket/store-pickup', { path: 'basket-home' });
    const data = this.cartData;
    this.navigation.forward('app/ecommerce/basket/store-pickup', {
      path: 'basket-home',
      data: data,
    });
  }

  focus() {
    this.showMenuInput = true;
    this.isInputFocus = true;
  }

  blur(itemId: number) {
    this.showMenuInput = false;
    this.checkStock(itemId);
    try {
      setTimeout(() => {
        if (this.isInputFocus != true) {
          this.showMenu = false;
        }
      }, 100);
    } catch (e) {
    }
  }

  blurVariant(itemId: number, variantId: number) {
    this.showMenuInput = false;
    this.checkStock(itemId, variantId);
    try {
      setTimeout(() => {
        if (this.isInputFocus != true) {
          this.showMenu = false;
        }
      }, 100);
    } catch (e) {
    }
  }

  checkStock(itemId: number, variantId?: number) {
    if (!variantId) {
      let item = this.cartItems.find(e => e.item.id === itemId);
      let indexTtem = this.cartItems.findIndex(e => e.item.id === itemId);
      let itemStock = item.item.stock;
      let quatity = item.data.quantity;
      if (itemStock > item.data.quantity) {
      } else {
        this.cartItems[indexTtem].data.quantity = itemStock;
        quatity = itemStock;
      }
      if (item.data.quantity == 0) {
        this.cartItems[indexTtem].data.quantity = 1;
        quatity = 1;
      }
      this.updateProductQuantity(itemId, quatity);
    } else {
      //let item = this.cartItems.find(e => e.item.id === itemId);
      let indexItem = this.cartItems.findIndex(e => e.item.id === itemId);
      let variant = this.cartItems[indexItem].item.variants.find((e: any) => e.id === variantId);
      let variantWithAmount = this.cartItems[indexItem].data.variants.find((e: any) => e.id === variantId);
      let indexVariant = this.cartItems[indexItem].data.variants.findIndex((e: any) => e.id === variantId);
      if (variantWithAmount.quantity > variant.stock) {
        this.cartItems[indexItem].data.variants[indexVariant].quantity = variant.stock;
      }
      if (variantWithAmount.quantity == 0) {
        this.cartItems[indexItem].data.variants[indexVariant].quantity = 1;
      }
      let updatedVariants = this.cartItems[indexItem].data.variants;
      let totalQuatity = this.cartItems[indexItem].data.variants.reduce(
        (total: number, variant: any) => {
          return total + parseFloat(variant.quantity);
        }, 0
      );
      this.updateProductQuantity(itemId, totalQuatity, updatedVariants);

    }

  }

  updateProductQuantity(id: number, quantity: number, variants?: any) {
    if (!variants) {
      this._basketServiceProxy.cartAddProduct(id, quantity)
        .subscribe({
          next: () => {
            const message = this.localization.localize('general.productAddedToCart', 'ecommerce');
            this.getCartItems();
            this._basketService.getBasket();
            this.notify.success(message, 2500);
            this.isLoading = false;
          },
          error: (error: ApiException) => {
            this.message.exception(error);
          }
        });
    } else {
      this._basketServiceProxy.cartAddProduct(id, quantity, variants)
        .subscribe({
          next: () => {
            const message = this.localization.localize('general.productAddedToCart', 'ecommerce');
            this.getCartItems();
            this._basketService.getBasket();
            this.notify.success(message, 2500);
            this.isLoading = false;
          },
          error: (error: ApiException) => {
            this.message.exception(error);
          }
        });
    }

  }

  indexSelectedFn(event: any) {
    this.indexSelected = event;
  }

  positionSelectedFn(event: any) {
    this.positionSelected = event;
  }

  delete(id: number) {
    this.clickDeleteOneProduct(id);
  }

  deleteVariant(cartItemId: any, index: number, setDesktop: boolean) {
    this.clickDeleteVariantProduct(cartItemId, index, setDesktop);
  }

  deleteVariantProduct(cartItemId: any, index: number) {
    const cartItem = this.cartItems.find(cartItem => cartItem.data.item_id == cartItemId);
    const variantToDelete = cartItem.data.variants.find((variant: any) => variant.id === index);
    //const indexVariantToDelete = cartItem.data.variants.findIndex((variant: any) => variant.id === index);
    const quantityToSub = variantToDelete.quantity;
    const totalOfProducts = cartItem.quantity - quantityToSub;
    //cartItem.data.variants[indexVariantToDelete].quantity = 0;
    if (cartItem.data.variants.length == 1) {
      this.deleteItem(cartItem.id);

    } else {
      let cartItemsToUpdate = cartItem.data.variants.filter((e: any) => e.id != variantToDelete.id);
      this._basketServiceProxy.cartAddProduct(cartItemId, totalOfProducts, cartItemsToUpdate).subscribe(
        (_data) => {
          this.getCartItems();
          this._basketService.getBasket();
        }
      );
    }


  }

  async clickDeleteOneProduct(id: number) {
    await this.dialog.showWithData<'cancel' | any>({
      component: DeleteProductComponent,
      componentProps: {
        id: id,
      },
      cssClass: ['modal-custom', 'modal-custom--in-center']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.deleteItem(id);
      }
    });
  }

  async clickDeleteVariantProduct(cartItemId: any, index: number, setDesktop: boolean) {
    let classModal = setDesktop ? 'modal-custom--in-center-desktop' : 'modal-custom--in-center'
    await this.dialog.showWithData<'cancel' | any>({
      component: DeleteProductComponent,
      cssClass: ['modal-custom', classModal],
      componentProps: {
        desktop: setDesktop
      }
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.deleteVariantProduct(cartItemId, index);
      }
    });
  }

  calculatePriceToPayWithVariant(variants: any, variantId: number, quantity: number): number {
    let priceToPay = 0.0;
    let indexVariant = variants.findIndex((variant: any) => variant.id == variantId);
    if (indexVariant != -1) { 
      priceToPay = variants[indexVariant].price;
      let variant = variants[indexVariant];
      if (variant.prices.length > 0) {
        variant.prices.forEach(
          (price: any) => {
            if (quantity >= price.min_quantity && quantity <= price.max_quantity) {
              if (price.in_offer == true) {
                priceToPay = price.offer_price;
              } else {
                priceToPay = price.price;
              }
            }
          }
        );
      } else {
        if (variant.in_offer == true) {
          priceToPay = variant.offer_price;
        } else {
          priceToPay = variant.price;
        }
      }
    }
    return priceToPay;
  }

  calculatePriceToPayWithoutVariant(item: any, quantity: number): number {
    let priceToPay = 0.0;
    if (item.prices.length > 0) {
      item.prices.forEach(
        (price: any) => {
          if (quantity >= price.min_quantity && quantity <= price.max_quantity) {
            if (price.in_offer == true) {
              priceToPay = price.offer_price;
            } else {
              priceToPay = price.price;
            }
          }
        }
      );
    } else {
      if (item.in_offer == true) {
        priceToPay = item.offer_price;
      } else {
        priceToPay = item.price;
      }
    }
    return priceToPay;
  }

  onBackButtonPressed() {
    const queryParams = this._activatedRoute.snapshot.queryParams;

    const path = queryParams.path || 'home';
    let targetRoute = '';
    if (path.includes('detail-product')) {
      targetRoute = `/app/ecommerce/home/${path}`;
    } else {
      switch (path) {
        case 'variants':
          targetRoute = `/app/ecommerce/home/variants/${queryParams.id}/${queryParams.description}`;
          break;
        default:
          targetRoute = '/app/ecommerce/home/home';
          break;
      }
    }

    this.navigation.back(targetRoute);
  }
}