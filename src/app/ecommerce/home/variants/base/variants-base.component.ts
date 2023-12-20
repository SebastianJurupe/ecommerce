import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { ApiException, AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { ViewWillEnter } from '@ionic/angular';
import { BasketServiceProxy } from '@shared/proxies/basket/basket.proxie.service';
import { ProductGetDetailsAdditionalDto, ProductGetDetailsDataDto, ProductServiceProxy } from '@shared/proxies/home/product.proxie';
import { AddProductDesktopComponent } from '../../modals/add-product-desktop/add-product-desktop.component';
import { AddProductComponent } from '../../modals/add-product/add-product.component';
import { ImageProductCompleteDesktopComponent, ImageProductCompleteMobileComponent } from '../../modals/image-product-complete';
import { BasketService } from '@shared/services/basket.service';
import { AnimationModalService } from '@shared/services/animation-modal.service';

@Component({
  templateUrl: 'variants-base.component.html',
  styleUrls: ['variants-base.component.scss'],
  host: { 'app.variants-base': 'true' }
})

export class VariantsBaseComponent extends ViewComponent implements OnInit, ViewWillEnter {

  private _animationModalService: AnimationModalService;
  private _activateRoute: ActivatedRoute;
  private _basketServiceProxy: BasketServiceProxy;
  private _basketService: BasketService;
  private _configuration: AppConfigurationService;
  private _productServiceProxy: ProductServiceProxy;
  private _toolbar: AppTabService;

  allVariantsOutOfStock: boolean = true;
  attributeVariants: any[] = [];
  cartQuantityWithoutVariant: number = 0;
  colors: string[] = [];
  device: string;
  filteredAttributes: string[] = [];
  idCartQuantityMap: { [id: number]: any; } = {};
  indexSelected: number = 0;
  indexSelectedVariant: number = 0;
  lastVariantName: string = 'Color';
  matchingVariants: any[] = [];
  onFocusButtonIncremental: boolean = false;
  selectedAttributes: { [key: string]: string | null; } = {};
  selectedValues: { [key: string]: string | null; } = {};
  selectedVariant: any;
  showColorAttribute: boolean = false;
  showFirstText = false;
  showMenuInput: boolean = false;
  showSecondText = false;
  totalPriceWithCurrency: string = '';
  totalQuantity: number = 0;
  totalToPay: number = 0;
  unitType: string = '';
  variantColors: any[] = [];
  dataVariant: any;
  cartData: any;
  isAddToBasketLoading: boolean = false;
  isGoToPayLoading: boolean = false;
  variantSelectedArray: any[] = [];
  variantSelectedMax: any = null;
  cartQuantityMap: { [key: string]: number } = {};
  cartQuantityTotal: number = 0;
  uniqueFilteredVariants: { [key: string]: any }[] = [];
  product: ProductGetDetailsDataDto = {
    id: 0,
    description: '',
    internal_id: '',
    price: 0,
    in_offer: false,
    offer_price: 0,
    prices: [],
    stock: 0,
    has_variants: true,
    files: [],
    variants: [],
    currency: {
      id: '',
      description: '',
      symbol: ''
    },
    unit_type: {
      id: '',
      description: ''
    },
    additional: new ProductGetDetailsAdditionalDto,
    specifications: []
  };

  constructor(_injector: Injector) {
    super(_injector);
    this._animationModalService = _injector.get(AnimationModalService);
    this._activateRoute = _injector.get(ActivatedRoute);
    this._basketServiceProxy = _injector.get(BasketServiceProxy);
    this._basketService = _injector.get(BasketService);
    this._configuration = _injector.get(AppConfigurationService);
    this._productServiceProxy = _injector.get(ProductServiceProxy);
    this._toolbar = _injector.get(AppTabService);
    this.device = this._configuration.screen();
  }

  get addToCartModalComponent() {
    return this.device === 'mobile'
      ? AddProductComponent
      : AddProductDesktopComponent;
  }

  get addToCartModalClasses(): string[] {
    return this.device === 'mobile'
      ? ['modal-custom', 'modal-custom--bottom']
      : ['modal-custom', 'modal-custom--in-center-small'];
  }

  get enterAnimation() {
    return this.device === 'mobile'
      ? undefined
      : this._animationModalService.openDesktopModal;
  }

  get leaveAnimation() {
    return this.device === 'mobile'
      ? undefined
      : this._animationModalService.closeDesktopModal;
  }

  ngOnInit() {
    const { id } = this._activateRoute.snapshot.params;
    if (id !== null && id !== undefined) { this.getProductDetails(id); }
    this._basketService.getBasket();

  }

  ionViewWillEnter(): void {
    this._toolbar.hide();
  };

  getProductDetails(id: number) {
    this._productServiceProxy.getProductsDetail(id)
      .subscribe({
        next: (response) => {
          this.product = response.data;
          this.getUniqAttributes(this.product.variants);
          this.getAttributeVariants(this.product.variants);
          this.lastVariantName = this.attributeVariants[0];
          console.log('uniqueFilteredVariants:', this.uniqueFilteredVariants);

          if (this.attributeVariants.length === 1) {
            this.matchingVariants = this.product.variants;
            this.updateDisplayedData(this.matchingVariants);
          }
          this.colors = this.getValueColors('Color');

          let filteredVariants: { [key: string]: any }[] = [];

          if (this.product.variants && this.product.variants.length > 0) {
            const referenceVariant = this.product.variants[0];

            if (referenceVariant.values && Array.isArray(referenceVariant.values)) {
              const referenceAttributes = referenceVariant.values
                .filter(value => value.attribute !== 'Color')
                .map(value => ({ [value.attribute]: value.value }));

              filteredVariants = this.product.variants.reduce((result, variant) => {
                if (variant.values && Array.isArray(variant.values)) {
                  const match = variant.values.every(value => {
                    if (value.attribute !== 'Color') {
                      const matchingAttribute = referenceAttributes.find(attr => attr[value.attribute]);
                      return matchingAttribute && matchingAttribute[value.attribute] === value.value;
                    }
                    return true;
                  });

                  if (match) {
                    const filteredVariant: { [key: string]: any } = {};

                    variant.values.forEach(value => {
                      if (value.attribute !== 'Color') {
                        filteredVariant[value.attribute] = value.value;
                      }
                    });

                    result.push(filteredVariant);
                  }
                }
                return result;
              }, [] as { [key: string]: any }[]);
            }
          }

          const filteredSet = new Set<string>();
          filteredVariants.forEach(variant => {
            const variantString = JSON.stringify(variant);
            if (!filteredSet.has(variantString)) {
              filteredSet.add(variantString);
              this.uniqueFilteredVariants.push(variant);
            }
          });

          this.product.variants.forEach(variant => {
            let variantMatches = true;
            this.uniqueFilteredVariants.forEach(uniqueVariant => {
              for (const attribute in uniqueVariant) {
                if (variant.values.some(value => value.attribute === attribute && value.value !== uniqueVariant[attribute])) {
                  variantMatches = false;
                  break;
                }
              }
            });
            if (variantMatches) {
              console.log(variant);
            }
          });
          this.setDefaultSelectedValues();
        },
        error: (error: ApiException) => this.message.exception(error)
      });
  }

  getUniqAttributes(data: any[]) {
    const attributes = data.map(variant => variant.values.find((value: any) => value.attribute));
    const uniqAttributes = [...new Set(attributes.map(item => item.attribute))];
    this.filteredAttributes = uniqAttributes;
  }

  setDefaultSelectedValues() {
    if (this.uniqueFilteredVariants.length > 0) {
      const defaultValues = this.uniqueFilteredVariants[0];
      for (const key in defaultValues) {
        if (defaultValues.hasOwnProperty(key)) {
          this.selectedValues[key] = defaultValues[key];
          this.handleOptionClick(key, defaultValues[key]);
        }
      }
    }
  }

  getAttributeVariants(data: any[]) {
    const allAttributes = new Set();
    data.forEach(variant => {
      variant.values.forEach((value: { attribute: any; }) => {
        if (value.attribute) {
          allAttributes.add(value.attribute);
        }
      });
    });
    this.attributeVariants = Array.from(allAttributes);
  }

  getAttributeVariantsValue(attribute: string): string[] {
    const uniqueValues = new Set<string>();
    this.product.variants.forEach(variant => {
      variant.values.forEach(value => {
        if (value.attribute === attribute && value.attribute !== 'Color') {
          uniqueValues.add(value.value);
        }
      });
    });
    return Array.from(uniqueValues);
  }

  openToCartModal() {
    this.dialog.showWithData({
      component: this.addToCartModalComponent,
      enterAnimation: this.enterAnimation,
      leaveAnimation: this.leaveAnimation,
      cssClass: this.addToCartModalClasses
    }).then((res) => {
      const response = res.data.result;
      if (response !== 'cancel') {
        if (response === 'viewBasket') {
          const formattedDescription = this.product.description.replace(/\s+/g, '-');

          this.navigation.forward('/app/ecommerce/basket/home', { path: 'variants', id: this.product.id, description: formattedDescription });
        } else {
          this.navigation.forward('/app/ecommerce/home/home');
        }
      }
    });
  }

  addToBasket(executeModal = true, goToPay?: boolean) {
    this.isAddToBasketLoading = true;
    if (goToPay) {
      goToPay
        ? this.isGoToPayLoading = true
        : this.isAddToBasketLoading = true;
      // this.navigation.forward('app/ecommerce/basket/store-pickup');
    }
    if (this.product.has_variants === true) {
      this.addToBasketWithVariants(executeModal, goToPay);
    } else {
      this.addToBasketWithoutVariants(executeModal, goToPay);
    }
    // this.isAddToBasketLoading = false;
  }

  addToBasketWithVariants(executeModal = true, goToPay?: boolean) {
    let globalQuantity = 0;
    let variants = [];
    const entries = Object.entries(this.idCartQuantityMap);
    for (let item of entries) {
      try {
        if (item[1].cartQuantity) {
          let variant = {
            'id': item[1].id,
            'quantity': item[1].cartQuantity,
          };
          if (variant.quantity > 0) {
            variants.push(variant);
            globalQuantity = globalQuantity + variant.quantity;
          }
        }
      } catch (e) { }
    }
    this._basketServiceProxy.cartAddProduct(this.product.id, globalQuantity, variants)
      .subscribe({
        next: (data: any) => {
          this._basketService.getBasket();

          goToPay
            ? this.isGoToPayLoading = false
            : this.isAddToBasketLoading = false;
          this._basketService.getBasket();
          this.cartData = data;

          if (goToPay) {
            // const data = this.cartData.data;
            // // this.navigation.forward('app/ecommerce/basket/store-pickup', {
            // //   path: `variants/${this.product.id}`,
            // //   data: data,
            // // });
            this.navigation.forward('app/ecommerce/basket/store-pickup');
          }
          if (executeModal) {
            this.openToCartModal();
            goToPay
              ? this.isGoToPayLoading = false
              : this.isAddToBasketLoading = false;
          }
        },
        error: (error) => {
          this.message.exception(error);
          this.isAddToBasketLoading = false;
          this.isGoToPayLoading = true;
        },
      });
  }

  addToBasketWithoutVariants(executeModal = true, goToPay?: boolean) {
    this._basketServiceProxy.cartAddProduct(this.product.id, this.cartQuantityWithoutVariant)
      .subscribe({
        next: () => {
          this._basketService.getBasket();
          if (goToPay) {
            this.isGoToPayLoading = false;
            this.navigation.forward('app/ecommerce/basket/store-pickup');
          }
          executeModal && this.openToCartModal();
          this.isAddToBasketLoading = false;
        },
        error: (error) => {
          this.message.exception(error);
        }
      });
  }

  async setIndexSelected(id: number) {
    this.indexSelectedVariant = this.matchingVariants.findIndex(variant => variant.id === id);
  }

  async calculateTotal() {
    let variantSelected: any = null;

    if (!this.product.has_variants) {
      this.calculateTotalWithoutVariants(variantSelected);
    } else {
      this.calculateTotalWithVariants(variantSelected);
    }

  }

  async calculateTotalWithVariants(variantSelected: any) {
    variantSelected = await this.matchingVariants[this.indexSelectedVariant];
    this.selectedVariant = await variantSelected;
    if (this.matchingVariants[this.indexSelectedVariant].cartQuantity > variantSelected.stock) {
      setTimeout(() => {
        this.matchingVariants[this.indexSelectedVariant].cartQuantity = variantSelected.stock;
        variantSelected.cartQuantity = this.matchingVariants[this.indexSelectedVariant].cartQuantity;
        this.calculateDynamicTotal(variantSelected);
      }, 50);
    } else {
      variantSelected.cartQuantity = this.matchingVariants[this.indexSelectedVariant].cartQuantity;
      this.calculateDynamicTotal(variantSelected);
    }
    const existingIndex = this.variantSelectedArray.findIndex((item) => item.id === variantSelected.id);
    if (existingIndex !== -1) {
      if (this.variantSelectedArray[existingIndex].cartQuantity < variantSelected.cartQuantity) {
        this.variantSelectedArray[existingIndex] = variantSelected;
      }
    } else {
      this.variantSelectedArray.push(variantSelected);
    }
    const filteredData = this.variantSelectedArray.filter((item) => item.cartQuantity !== undefined);
    const groupedData = filteredData.reduce((acc, currentItem) => {
      const lastIndex = currentItem.values.length - 1;
      const { attribute, value } = currentItem.values[lastIndex];
      const cartQuantity = currentItem.cartQuantity;
      const key = `${attribute}-${value}`;
      if (!acc[key]) {
        acc[key] = {
          attribute,
          value,
          cartQuantityTotal: cartQuantity
        };
      } else {
        acc[key].cartQuantityTotal += cartQuantity;
      }
      return acc;
    }, {});

    const result = Object.values(groupedData);
    result.forEach((item: any) => {
      const key = `${item.attribute}-${item.value}`;
      this.cartQuantityMap[key] = item.cartQuantityTotal;
    });
    console.log(this.cartQuantityMap);
  }

  async calculateTotalWithoutVariants(variantSelected: any) {
    variantSelected = this.product;
    if (this.cartQuantityWithoutVariant > variantSelected.stock) {
      setTimeout(() => {
        this.cartQuantityWithoutVariant = variantSelected.stock;
        variantSelected.cartQuantity = this.cartQuantityWithoutVariant;
        this.calculateDynamicTotal(variantSelected);
      }, 50);

    } else {
      variantSelected.cartQuantity = this.cartQuantityWithoutVariant;
      this.calculateDynamicTotal(variantSelected);
    }
    variantSelected.priceToPay = 0;
    this.selectedVariant = await variantSelected;
  }

  calculateDynamicTotal(variantSelected: any) {
    let cartQuantity = variantSelected.cartQuantity;
    let isInRangeOfPrices = false;
    let pricetoPay = 0;
    if (variantSelected.prices.length > 0) {
      variantSelected.prices.forEach((price: any) => {
        if (
          (cartQuantity <= variantSelected.stock) &&
          (cartQuantity >= price.min_quantity && cartQuantity <= price.max_quantity)) {
          isInRangeOfPrices = true;
          if (price.in_offer) {
            pricetoPay = price.offer_price;
          } else {
            pricetoPay = price.price;
          }
        }
      });
    }

    if (cartQuantity > variantSelected.stock) {
      this.notify.warn('Producto no cuenta con más stock', 2500);
    }

    if (!isInRangeOfPrices && cartQuantity <= variantSelected.stock) {
      if (variantSelected.in_offer) {
        pricetoPay = variantSelected.offer_price;
      } else {
        pricetoPay = variantSelected.price;
      }
    }

    if (!this.product.has_variants) {
      variantSelected.priceToPay = pricetoPay;
      this.totalToPay = 0.0;
      this.totalToPay += variantSelected.priceToPay * this.cartQuantityWithoutVariant;
      this.calculateTotalAndUnitType();
    } else {
      this.matchingVariants[this.indexSelectedVariant].priceToPay = pricetoPay;
      this.idCartQuantityMap[variantSelected.id] = { ...this.matchingVariants[this.indexSelectedVariant] };
      this.totalToPay = 0.0;
      let entries = Object.entries(this.idCartQuantityMap);
      for (let item of entries) {
        try {
          if (item[1].cartQuantity) {
            this.totalToPay += item[1].priceToPay * item[1].cartQuantity;
          }
        } catch (e) {
          throw new Error(e as string);
        }
      }

      if (cartQuantity > variantSelected.stock) {
        let index = this.matchingVariants.findIndex(
          (value) => {
            return value.id === variantSelected.id;
          });
        setTimeout(() => {
          this.matchingVariants[index].cartQuantity = variantSelected.stock;
        }, 100);
      }

      setTimeout(() => {
        this.calculateTotalAndUnitType();
      }, 10);
    }
  }

  calculateTotalAndUnitType() {
    let total = 0;
    this.unitType = this.product.unit_type.description;

    if (this.product.has_variants) {
      let entries = Object.entries(this.idCartQuantityMap);
      for (let item of entries) {
        try {
          if (item[1].cartQuantity) {
            total += item[1].cartQuantity;
          }
        } catch (e) {
          throw new Error(e as string);
        }
      }

    } else {
      total = this.cartQuantityWithoutVariant;
    }

    this.showFirstText = true;
    this.totalQuantity = total;
  }

  updateDisplayedData(matchingVariants: any[]) {
    this.matchingVariants = matchingVariants;

    this.allVariantsOutOfStock = this.matchingVariants.every(variant => variant.stock === 0);

    if (this.allVariantsOutOfStock) {
      this.notify.warn('No se encontró ningún producto con las características seleccionadas.', 2500);
    }

    for (const variant of this.matchingVariants) {
      const id = variant.id;
      if (this.idCartQuantityMap[id] !== undefined) {
        Object.assign(variant, this.idCartQuantityMap[id]);
      }
    }
    this.calculateTotal();
  }

  calculateTotalQuantity() {
    let prices = [];
    if (this.product.has_variants) {
      prices = this.selectedVariant.prices;
    } else {
      prices = this.product.prices;
    }
    const money = this.product.currency.symbol;
    let i = 0;

    if (prices.length === 0) {
      const totalPrecio = this.product.price * this.totalQuantity;
      this.totalPriceWithCurrency = money + ' ' + totalPrecio;
      this.showFirstText = true;
    } else {
      this.showSecondText = true;
    }

    prices.forEach((price: { max_quantity: number, min_quantity: number, offer_price: number; }) => {
      let max = price.max_quantity;
      let min = price.min_quantity;

      if (this.totalQuantity < min && i === 0) {
        const totalPrecio = this.product.price * this.totalQuantity;
        this.totalPriceWithCurrency = money + ' ' + totalPrecio;
        this.showFirstText = true;
        this.showSecondText = false;
      }
      if (this.totalQuantity >= min && this.totalQuantity <= max || this.totalQuantity > max) {
        const totalPrecio = price.offer_price * this.totalQuantity;
        this.totalPriceWithCurrency = money + ' ' + totalPrecio;
        this.showSecondText = true;
        this.showFirstText = false;
      }
      i++;
    });

    this.matchingVariants.forEach((variant, i) => {
      if (variant.cartQuantity > variant.stock) {

        setTimeout(() => {
          this.matchingVariants[i].cartQuantity = variant.stock;
        }, 0);
      }
    });

    setTimeout(() => {
      this.calculateTotalAndUnitType();
    }, 10);
  }

  handleInput(event: any) {
    const inputValue = event.target.value;
    const variantSelected = this.matchingVariants[this.indexSelectedVariant];

    if (parseInt(inputValue, 10) > variantSelected.stock) {
      this.notify.warn('Producto no cuenta con más stock', 2500);

      this.matchingVariants[this.indexSelectedVariant].cartQuantity = variantSelected.stock;

      this.calculateTotal();
    }

  }

  handleOptionClick(attribute: string, value: string) {
    this.selectedAttributes[attribute] = value;
    const matchingVariants = this.filterVariantsBySelections(this.product.variants, this.selectedAttributes);

    this.selectedValues[attribute] = value;
    const atLeastOneAttributeSelected = Object.values(this.selectedValues).some(value => value !== null);

    this.showColorAttribute = atLeastOneAttributeSelected;
    this.updateDisplayedData(matchingVariants);
    this.calculateTotal();

  }

  asd() {
    if (this.indexSelectedVariant < this.matchingVariants.length) {
      this.dataVariant = this.matchingVariants[this.indexSelectedVariant];
    } else {
    }
  }

  filterVariantsBySelections(variants: any[], selections: { [key: string]: string | null; }): any[] {
    return variants.filter((variant) => {
      for (const attribute in selections) {
        if (selections[attribute] && selections[attribute] !== variant.values.find((value: { attribute: string; }) => value.attribute === attribute)?.value) {
          return false;
        }
      }
      return true;
    });
  }

  areAllAttributesSelectedExceptColor(): boolean {
    for (const attribute of this.attributeVariants) {
      if (attribute !== 'Color' && !this.selectedValues[attribute]) {
        return false;
      }
    }
    return true;
  }

  getValueColors(attribute: string): string[] {
    const uniqueValues = new Set<string>();

    this.product.variants.forEach(variant => {
      variant.values.forEach(value => {
        if (value.attribute === attribute) {
          uniqueValues.add(value.value);
        }
      });
    });
    return Array.from(uniqueValues);
  }

  isAddToBasketDisabled(): boolean {

    if (this.isGoToPayLoading === true) {
      this.isAddToBasketLoading = false;
      return true;
    }

    if (this.isAddToBasketLoading) {
      return true;
    }

    if (this.product.has_variants === true) {
      for (const item of this.matchingVariants) {
        if (item.cartQuantity > 0) {
          return false;
        }
      }
      if (this.totalToPay > 0) {
        return false;
      }
    } else {
      if (this.cartQuantityWithoutVariant > 0) {
        return false;
      }
    }
    return true;
  }

  async share() {
    await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: 'https://geor.app/',
      dialogTitle: '',
    });
  }

  openImg(id: number) {

    if (this.device == 'mobile') {
      const variantData = this.matchingVariants.find(variant => variant.id === id);
      this.dialog.showWithData({
        component: ImageProductCompleteMobileComponent,
        cssClass: ['modal-custom', 'modal-custom--full'],
        componentProps: {
          imagesVariantsProduct: variantData.files
        }
      });
    }
    if (this.device == 'desktop') {
      const variantData = this.matchingVariants.find(variant => variant.id === id);
      this.dialog.showWithData({
        component: ImageProductCompleteDesktopComponent,
        componentProps: {
          imagesVariantsProduct: variantData.files
        },
        enterAnimation: this._animationModalService.openDesktopModal,
        leaveAnimation: this._animationModalService.closeDesktopModal,
        cssClass: ['modal-custom', 'modal-custom--full'],
      });
    }

  }

  focus() {
    this.showMenuInput = true;
    this.onFocusButtonIncremental = true;
  }

  blur() {
    this.onFocusButtonIncremental = false;
    this.showMenuInput = false;
    setTimeout(
      () => {
        if (this.onFocusButtonIncremental == false) {
          this.showMenuInput = false;
        }
      }, 500
    );
  }

  clearButtonIncrementalValue(index: number) {
    if (this.matchingVariants && this.matchingVariants.length > index) {
      this.matchingVariants[index].cartQuantity = 0;
    }
  }

  clickOk() {
    this.showMenuInput = false;
    this.calculateTotalQuantity();
  }

  goPay() {
    this.addToBasket(false, true);
  }

  showLastVariant(_items: any, _nameVariant: string) {
    this.lastVariantName = _nameVariant;
    let itemsLastVariants = [];
    for (let item of _items) {
      let value = item.values.filter((value: any) => {
        return value.attribute === _nameVariant;
      });
      value[0].quantity = 0;
      itemsLastVariants.push(value[0]);
    }
  }

  getValueOfValues(values: any, _nameAttribute: string) {
    let value = values.filter((value: any) => {
      return value.attribute === _nameAttribute;
    });
    return value;
  }

  onBackButtonPressed(id: number, description: string) {
    const formattedDescription = description.replace(/\s+/g, '-');
    this.navigation.back(`app/ecommerce/home/detail-product/${id}/${formattedDescription}`);
  }
}
