import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiException, ViewComponent } from '@geor360/core';
import { IonContent } from '@ionic/angular';
import { ProductGetAllOutputDataDto, ProductGetCategoriesDetailOutputProductsDto, ProductServiceProxy } from '@shared/proxies/home/product.proxie';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { BasketService } from '@shared/services/basket.service';
import { Observable, Subscription } from 'rxjs';
import { variantCommonI } from '../../category-products';
import { FilterMobileComponent } from '../../filter';
import { AppTabService } from '@geor360/core';

export interface MainInfo {
  itemCount: number;
  categoryCounts: { [key: string]: number; };
}
@Component({
  templateUrl: 'products-filter-base.component.html',
  styleUrls: ['products-filter-base.component.scss'],
  host: { 'app.products-filter-base': 'true' },
})
export class ProductsFilterBaseComponent extends ViewComponent implements OnInit {

  _activateRoute: ActivatedRoute;
  private _authTokenService: AuthTokenService;
  _basketService: BasketService;
  toolbar: AppTabService
  @ViewChild('content') content!: IonContent;
  productSubscription!: Subscription;
  productSubscriptionVariants!: Subscription;

  actionClear = false;
  allProducts: ProductGetAllOutputDataDto[] = [];
  basketIdProductInFocus = 0;
  basketProductQuantity: any[] = [];
  basketQuantityProductInFocus = 0;
  count$: Observable<number> | undefined;
  filterChanged: boolean = false;
  isActionClearPressed = false;
  isActionOkPressed = false;
  isCardProductFocused: boolean = false;
  keyboardWillShow: boolean = false;
  mainInfo: MainInfo = { itemCount: 0, categoryCounts: {} };
  noResultsMessageVisible: boolean = false;
  onFocusCardProduct: boolean = false;
  platform: string = '';
  products: ProductGetCategoriesDetailOutputProductsDto[] = [];
  productsInitial: ProductGetCategoriesDetailOutputProductsDto[] = [];
  productsVariants: ProductGetCategoriesDetailOutputProductsDto[] = [];
  productServiceProxy: ProductServiceProxy;
  searchProducts: string = '';
  searchValue: string = '';
  selectedCategory: any;
  selectedCategoryId: number = 0
  selectedColor: string | null = null;
  selectedMaxPrice: any
  selectedMinPrice: any
  selectedMaxPriceFiltered: number = 0;
  selectedMinPriceFiltered: number = 0;
  selectedVariants: { [key: string]: string | null; } = {}; showFilterIcon: boolean = false;
  showMenuInput: boolean = false;
  subscriber: Subscription = new Subscription;
  totalItems: number = 0;
  variantsCommonsWithValues: any[] | undefined;
  variantsCommonsWithValuesInitial: any[] | undefined;
  page: number = 2;
  totalPages: number = 0;
  arrayVariants = []
  dataFilteredAdvanced: any
  searching: boolean = false
  productDetail: boolean = false
  constructor(_injector: Injector) {
    super(_injector);
    this._activateRoute = _injector.get(ActivatedRoute);
    this._authTokenService = _injector.get(AuthTokenService);
    this._basketService = _injector.get(BasketService);
    this.productServiceProxy = _injector.get(ProductServiceProxy);
    this.toolbar = _injector.get(AppTabService);
  }

  get isAuthenticated() {
    return new Promise((resolve) => {
      this._authTokenService.isAuthenticated()
        .subscribe((isAuthenticated) => {
          resolve(isAuthenticated);
        });
    });
  }

  ngOnInit() {
    this.subscriber = this._activateRoute.queryParams.subscribe(params => {
      const { searchValue } = params;
      this.searchValue = searchValue || '';
      if (!this.productDetail) {
        this.onGetProductsSearch();
        this.onGetProductsVariants()
      }
      this.count$ = this._basketService.getCount();

    });
  }

  onProductCardBlur() {
    this.isCardProductFocused = false;

    setTimeout(() => {
      if (this.isCardProductFocused === false) {
        this.showMenuInput = false;
      }
    }, 500);

    if (!this.isActionClearPressed && !this.isActionOkPressed) {
      this.onUpdateBasket();
    } else {
      this.isActionOkPressed = false;
    }
  }

  onUpdateBasket() {
    const product = this.basketProductQuantity.filter(({ productId }) => productId === this.basketIdProductInFocus);
    const basketQuantityProductInFocus = parseInt(product[0].quantity as string);
    const productIndex = this.basketProductQuantity.findIndex(({ productId }) => productId === this.basketIdProductInFocus);
    if (Number.isNaN(basketQuantityProductInFocus)) {
      this._basketService.getBasketCode()
        .then(() => {
          const indexInBasket = this._basketService.getIdInBasket(product[0].productId);
          this._basketService.deleteProductInBasket(indexInBasket);
          this.basketProductQuantity[productIndex].quantity = undefined;
        });
    }
    if (!Number.isNaN(basketQuantityProductInFocus) && basketQuantityProductInFocus == 0) {
      this._basketService.getBasketCode()
        .then(() => {
          const indexInBasket = this._basketService.getIdInBasket(product[0].productId);
          this._basketService.deleteProductInBasket(indexInBasket);
          this.basketProductQuantity[productIndex].quantity = undefined;
        });
    }
    if (!Number.isNaN(basketQuantityProductInFocus)) {
      const stockAvailable = this.onGetStock(this.products, product[0].productId);

      if (stockAvailable >= basketQuantityProductInFocus) {
        this._basketService.updateQuantityProduct(this.basketIdProductInFocus, basketQuantityProductInFocus).then(
          () => {
            this._basketService.getBasket();
            this.onGetTotalItems();
          }
        );
      } else {
        const message = this.localization.localize('general.insufficientStock', 'ecommerce');
        this.notify.warn(message, 1000);
        this._basketService.updateQuantityProduct(this.basketIdProductInFocus, stockAvailable, false)
          .then(() => {
            setTimeout(() => {
              const indexProduct = this.basketProductQuantity.findIndex(({ productId }) => productId === this.basketIdProductInFocus);
              this.basketProductQuantity[indexProduct].quantity = stockAvailable;
              this._basketService.getBasket();
              this.onGetTotalItems();
            }, 10);
          });
      }
    }
  }

  onGetStock(products: any, idProduct: number) {
    const index = products.findIndex((product: any) => { return product.id === idProduct; });
    if (index == -1) {
      return -1;
    } else {
      return products[index].stock;
    }
  }

  async onClickShoppingCart(_index: number, productHasVariants: boolean, productId: number, description: string) {
    if (await this.isAuthenticated) {
      if (!productHasVariants) {
        this.showMenuInput = true;
      } else {
        this.navigateToProductDetail(productId, description);
      }
    } else {
      this.navigation.forward('/app/ecommerce/profile/login');
    }
  }

  navigateToProductDetail(id: number, description: string) {
    const formattedDescription = description.replace(/\s+/g, '-');
    this.productDetail = true
    this.navigation.forward(`/app/ecommerce/home/detail-product/${id}/${formattedDescription}`, { fromFilter: true });
  }

  async onClickInputCartShopping(_index: number) {
    if (await this.isAuthenticated) {
      this.showMenuInput = true;
    } else {
      this.navigation.forward('/app/ecommerce/profile/login');
    }
  }

  async onSearch(term: string) {
    const text = term.toLowerCase();
    this.searchValue = term;

    if (text === '') {
      // this.onGetProducts();
    } else {
      this.getAllProductsFilteres()
    }

  }

  onProductCardFocus() {
    this.isCardProductFocused = true;
    this.showMenuInput = true;
  }

  onSetSelectedProductCardIndex(index: number) {
    this.basketIdProductInFocus = index;
  }

  onHandleOffsetTop(offset: number, hasVariants: boolean) {
    if (offset !== 0 && !hasVariants) {
      this.content.scrollToPoint(0, offset - 300, 1000);
    }
  }

  onClickOk() {
    this.showMenuInput = false;
    this.onUpdateBasket();
    this.isActionOkPressed = true;
  }

  onClickClearOption() {
    this.isActionClearPressed = true;

    const index = this.basketProductQuantity.findIndex(product => product.productId === this.basketIdProductInFocus);
    this.basketProductQuantity[index].quantity = undefined;
    this._basketService.getBasketCode()
      .then(() => {
        this._basketService.removeItemOfBasket(this.basketIdProductInFocus);
      });
  }

  onGetProductsSearch() {
    this.productSubscription?.unsubscribe();
    this.productSubscription = this.productServiceProxy.getAll(this.searchValue, 1, 20).subscribe({
      next: (response) => {
        this.products = response.data;
        this.allProducts = response.data;
        this.productsInitial = this.products;
        if (response.data.length === 0) {
          this.noResultsMessageVisible = true;
          return
        }
        this.products.forEach(
          (product) => {
            this.basketProductQuantity.push({
              productId: product.id,
              quantity: undefined
            });
          }
        );
        this.productsInitial.forEach(
          (product) => {
            this.basketProductQuantity.push({
              productId: product.id,
              quantity: undefined
            });
          }
        );

        const pageSize = 20; // Tamaño de página
        const totalProducts = response.meta.total; // Cantidad total de productos
        this.totalPages = Math.ceil(totalProducts / pageSize);

        this.onGetTotalItems();
        this.onMatchWithBasket(this.products);
        if (this.products.length === 0) {
          setTimeout(() => {
            this.noResultsMessageVisible = true;
          }, 1000);
        } else {
          setTimeout(() => {
            this.noResultsMessageVisible = false;
          }, 1000);
          this.onGetCommonVariants(this.products);
          this.mainInfo = {
            itemCount: response.meta.total,
            categoryCounts: this.onCalculateProductCounts(this.products),
          };
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onGetProductsVariants() {
    this.searching = true

    this.productSubscriptionVariants = this.productServiceProxy.getAll(this.searchValue, 1, 500).subscribe({
      next: (response) => {
        this.productsInitial = response.data;
        this.variantsCommonsWithValuesInitial = this.onGetCommonVariants(this.products);
        this.searching = false
        this.productsInitial.forEach(
          (product) => {
            this.basketProductQuantity.push({
              productId: product.id,
              quantity: undefined
            });
          }
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  filterByCategory(selectedCategory: string) {
    if (selectedCategory != '') {
      this.productServiceProxy.getCategoriesDetail(selectedCategory, '500').subscribe({
        next: (response) => {
          const categoryProducts = response.data.products;

          const filteredProducts = categoryProducts.filter((product) => {
            return this.productsInitial.some((existingProduct) => existingProduct.id === product.id);
          });
          this.filterVariantsDesktop(filteredProducts)

          // const hasResults = filteredProducts.length > 0;

          // if (!hasResults) {
          //   this.noResultsMessageVisible = true;
          //   this.mainInfo.itemCount = 0;
          //   this.products = [];
          // } else {
          //   this.noResultsMessageVisible = false;
          //   this.products = filteredProducts;
          //   this.onUpdateMainInfo();
          // }
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.filterVariantsDesktop(this.productsInitial)
      this.showFilterIcon = false
    }
  }

  filterVariantsDesktop(data: any) {
    let filteredProducts: any = []
    if (Object.keys(this.selectedVariants).length != 0 || this.selectedColor) {

      filteredProducts = this.products.filter((product) => {
        const variantCondition = this.selectedVariants
          ? product.variants.some((variant) =>
            Object.entries(this.selectedVariants || {}).every(([attribute, selectedValue]) => {
              return variant.values.some((value) => {
                return value.attribute === attribute && value.value === selectedValue;
              });
            })
          )
          : true;

        const colorCondition = this.selectedColor
          ? product.variants.some((variant) =>
            variant.values.some((value) => value.color === this.selectedColor)
          )
          : true;

        return variantCondition && colorCondition;
      });
    } else {
      filteredProducts = data

    }


    if (this.selectedMaxPrice !== 0 || this.selectedMinPrice !== 0) {

      filteredProducts = filteredProducts.filter((product: any) => (
        (this.selectedMinPrice === 0 || product.price >= this.selectedMinPrice) &&
        (this.selectedMaxPrice === 0 || product.price <= this.selectedMaxPrice)
      ));
    }

    const hasResults = filteredProducts.length > 0;

    if (!hasResults) {
      this.noResultsMessageVisible = true;
      this.mainInfo.itemCount = 0;
      this.products = [];
    } else {
      this.noResultsMessageVisible = false;
      this.products = filteredProducts;
      this.onUpdateMainInfo();
    }

    this.products = filteredProducts;
    return filteredProducts;
  }

  onCalculateProductCounts(products: ProductGetCategoriesDetailOutputProductsDto[]) {
    const categoryCounts: { [key: number]: number; } = {};

    for (const product of products) {
      const categoryId = product.id;
      if (categoryCounts[categoryId]) {
        categoryCounts[categoryId]++;
      } else {
        categoryCounts[categoryId] = 1;
      }
    }
    return categoryCounts;
  }

  onShowFilterModal() {
    this.variantsCommonsWithValues = this.onGetCommonVariants(this.products);
    // this.variantsCommonsWithValuesInitial = this.onGetCommonVariants(this.products);
    this.dialog.showWithData<any>({
      component: FilterMobileComponent,
      componentProps: {
        selectedCategory: this.selectedCategory,
        selectedMinPrice: this.selectedMinPrice,
        selectedMaxPrice: this.selectedMaxPrice,
        selectedColor: this.selectedColor,
        variantsCommonsWithValues: this.variantsCommonsWithValuesInitial,
        selectedVariants: this.selectedVariants
      }
    }).then((res: any) => {
      if (res.data.result !== 'cancel') {
        this.selectedCategoryId = res.data.result.selectedCategoryId
        this.selectedCategory = res.data.result.selectedCategory;
        this.selectedMinPrice = res.data.result.selectedMinPrice;
        this.selectedMaxPrice = res.data.result.selectedMaxPrice;
        this.selectedColor = res.data.result.selectedColor;
        this.selectedVariants = res.data.result.selectedVariants;
        this.filterChanged = false;
        this.showFilterIcon = true
        this.searching = true
        let changeMin: boolean = false
        let changeMax: boolean = false
        if (this.selectedMinPrice === 0 || this.selectedMinPrice === '' || this.selectedMinPrice === undefined) {
          this.selectedMinPriceFiltered = 1
          changeMin = false
        } else {
          this.selectedMinPriceFiltered = this.selectedMinPrice
          changeMin = true
        }
        if (this.selectedMaxPrice === 0 || this.selectedMaxPrice === '' || this.selectedMaxPrice === undefined) {
          this.selectedMaxPriceFiltered = 99999999999
          changeMax = false
        } else {
          this.selectedMaxPriceFiltered = this.selectedMaxPrice
          changeMax = true
        }
        console.log(res.data.result);

        if (res.data.result.variantsAll.length === 0) {
          this.arrayVariants = []
        } else {
          this.arrayVariants = res.data.result.variantsAll
        }
        console.log(this.arrayVariants);

        if (this.selectedCategoryId === 0 && !changeMin && !changeMax && this.arrayVariants.length == 0 && Object.keys(this.selectedVariants).length === 0) {
          this.showFilterIcon = false
        } else {
          this.showFilterIcon = true
        }


        this.getAllProductsFilteres()
        // this.filterByCategory(this.selectedCategory);
        // if (this.selectedCategory) {
        //   this.showFilterIcon = true;
        //   console.log('entro category');

        //   this.onFilterCategory(this.selectedCategory);
        // } else if (this.selectedCategory) {
        //   this.showFilterIcon = true;
        //   console.log('entro category');
        //   this.onFilterAll(this.selectedCategory);
        // } else if (this.selectedMinPrice) {
        //   console.log('entro minPrice');
        //   this.showFilterIcon = true;
        //   this.onFilterByPriceRange();
        // } else if (this.selectedMaxPrice) {
        //   this.showFilterIcon = true;
        //   console.log('entro maxPrice');
        //   this.onFilterByPriceRange();
        // } else if (Object.keys(this.selectedVariants).length != 0 || this.selectedColor) {
        //   this.showFilterIcon = true;
        //   this.onFilterVariants();
        //   console.log('entro variante', Object.keys(this.selectedVariants).length);
        // }
        // else {
        //   this.showFilterIcon = false;
        //   this.onGetProductsSearch();
        // }
      }
    });
  }

  onFilterCategory(selectedCategory: string) {
    this.productServiceProxy.getCategoriesDetail(selectedCategory).subscribe({
      next: (response) => {
        const categoryProducts = response.data.products;
        this.products = this.productsInitial.filter((product) => {
          return categoryProducts.some((categoryProduct) => categoryProduct.id === product.id);
        });
        const hasResults = this.products.length > 0;
        if (!hasResults) {
          this.noResultsMessageVisible = true;
          this.mainInfo.itemCount = 0;
          // this.onGetProductsSearch();
        } else {
          this.noResultsMessageVisible = false;
          this.products = this.products;
          this.onUpdateMainInfo();
        }
      }
    });
  }

  onFilterVariantsDesktop() {
    const filteredProducts = this.productsInitial.filter((product) => {
      const variantCondition = this.selectedVariants
        ? product.variants.some((variant) =>
          Object.entries(this.selectedVariants || {}).every(([attribute, selectedValue]) => {
            return variant.values.some((value) => {
              return value.attribute === attribute && value.value === selectedValue;
            });
          })
        )
        : true;

      const colorCondition = this.selectedColor
        ? product.variants.some((variant) =>
          variant.values.some((value) => value.color === this.selectedColor)
        )
        : true;

      return variantCondition && colorCondition;
    });
    const hasResults = filteredProducts.length > 0;

    if (!hasResults) {
      this.noResultsMessageVisible = true;
    } else {
      this.products = filteredProducts;
    }

    this.products = filteredProducts;
    return filteredProducts;
  }

  onFilterByPriceRange() {
    if (this.selectedMinPrice === null || this.selectedMinPrice === 0) {
      this.selectedMinPrice = 1;
    }

    const filteredProducts = this.products.filter((product) => {
      return (
        (this.selectedMinPrice === null || product.price >= this.selectedMinPrice) &&
        (this.selectedMaxPrice === null || product.price <= this.selectedMaxPrice)
      );
    });

    const hasResults = filteredProducts.length > 0;

    if (!hasResults) {
      this.noResultsMessageVisible = true;
      this.mainInfo.itemCount = 0;
      this.showFilterIcon = false;
      this.onGetProductsSearch();
    } else {
      this.noResultsMessageVisible = false;
      this.products = filteredProducts;
      this.onUpdateMainInfo();
    }

    this.products = filteredProducts;
  }

  onFilterAll(selectedCategory: string) {
    this.productServiceProxy.getCategoriesDetail(selectedCategory).subscribe({
      next: (response) => {
        const categoryProducts = response.data.products;

        this.products = categoryProducts.filter((product) => {
          return product.variants.some((variant) => {
            return Object.entries(this.selectedVariants || {}).every(([attribute, selectedValue]) => {
              return variant.values.some((value) => {
                return (
                  value.attribute === attribute &&
                  value.value === selectedValue
                );
              });
            });
          });
        });

        const hasResults = this.products.length > 0;

        if (!hasResults) {
          this.noResultsMessageVisible = true;
          this.mainInfo.itemCount = 0;
          this.showFilterIcon = false;
          this.onGetProductsSearch();
        } else {
          this.noResultsMessageVisible = false;
          this.products = this.products;
          this.onUpdateMainInfo();
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onFilterVariants() {
    if (this.selectedVariants === null && this.selectedColor === null) {
      return;
    }

    const filteredProducts = this.productsInitial.filter((product) => {
      const variantCondition = this.selectedVariants
        ? product.variants.some((variant) =>
          Object.entries(this.selectedVariants || {}).every(([attribute, selectedValue]) =>
            variant.values.some((value) => value.attribute === attribute && value.value === selectedValue)
          )
        )
        : true;

      const colorCondition = this.selectedColor
        ? product.variants.some((variant) =>
          variant.values.some((value) => value.color === this.selectedColor)
        )
        : true;

      return variantCondition && colorCondition;
    });

    const hasResults = filteredProducts.length > 0;

    if (!hasResults) {
      this.noResultsMessageVisible = true;
      this.mainInfo.itemCount = 0;
      this.showFilterIcon = false;
      this.onGetProductsSearch();
    } else {
      this.noResultsMessageVisible = false;
      this.products = filteredProducts;
      this.onUpdateMainInfo();
    }

    this.products = filteredProducts;
  }

  onApplyCategoryFilter(selectedCategory: string) {
    this.productServiceProxy.getCategoriesDetail(selectedCategory).subscribe({
      next: (response) => {
        this.products = response.data.products;
        this.filterChanged = true;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onUpdateMainInfo() {
    this.mainInfo = {
      itemCount: this.products.length,
      categoryCounts: this.onCalculateProductCounts(this.products),
    };
    this.mainInfo.itemCount = Object.values(
      this.mainInfo.categoryCounts
    ).reduce((total, count) => total + count, 0);
  }

  onGetCommonVariants(products: ProductGetCategoriesDetailOutputProductsDto[] = []) {
    const variantsCommons: string[] = [];

    products.forEach((product) => {
      if (product.has_variants == true) {
        product.variants[0].values.forEach((value) => {
          if (!variantsCommons.includes(value.attribute)) {
            variantsCommons.push(value.attribute);
          }
        });
      }
    });

    const variantsCommonsWithValues: any[] = [];
    variantsCommons.forEach((variantCommon) => {
      const variantCommonWithValues: variantCommonI = {
        name: variantCommon,
        values: [],
        codes: [],
      };
      products.forEach((product) => {
        if (product.has_variants == true) {
          product.variants.forEach((variant) => {
            if (variant.values.length > 0) {
              const valueVariant = variant.values.filter((e) => {
                return e.attribute === variantCommon;
              });
              if (valueVariant.length > 0) {
                if (!variantCommonWithValues.values.includes(valueVariant[0].value)) {
                  variantCommonWithValues.values.push(valueVariant[0].value);
                  if (variantCommon == 'Color')
                    variantCommonWithValues.codes.push(valueVariant[0].color);
                }
              }
            }
          });
        }
      });
      variantsCommonsWithValues.push(variantCommonWithValues);
    });


    return variantsCommonsWithValues;
  }

  clearInput() {
    // this.navigation.back('/app/ecommerce/categories');
  }

  onApplyFilter(event: any) {
    this.onGetProductsSearch();
  }

  onGetTotalItems() {
    this.totalItems = this._basketService.getTotalItems();
  }

  onMatchWithBasket(basketProductQuantity: any) {
    const basket = this._basketService.getUserBasket();
    basket.items.forEach(item => {
      const element = basketProductQuantity.find((e: any) => e.id == item.data.item_id);
      const elementIndex = basketProductQuantity.findIndex((e: any) => e.id == item.data.item_id);
      if (elementIndex != -1 && element.has_variants == false) {
        this.basketProductQuantity[elementIndex].quantity = item.quantity;
      }
    });
  }


  async loadMoreDataMobile(event: any) {
    let categoryId: any = []

    if (this.selectedCategoryId === 0) {
      categoryId = []
    } else {
      categoryId = [this.selectedCategoryId]
    }
    if (this.page <= this.totalPages) {
      this.productServiceProxy.getAll(this.searchValue, this.page, 20, categoryId, this.arrayVariants, this.selectedMinPriceFiltered, this.selectedMaxPriceFiltered).subscribe({

        next: (response) => {
          // Puedes hacer lo que necesites con los productos de la página actual aquí
          this.page++;
          this.products.push(...response.data);


          if (this.products.length != 0) {
            let featuredProductsBackup = [...this.products];
            // this.featuredProducts = [];
            setTimeout(() => {
              this.basketProductQuantity = [];
              this.products = featuredProductsBackup;
              this.products.forEach(
                (product) => {
                  this.basketProductQuantity.push({
                    productId: product.id,
                    quantity: undefined,
                    lastQuantity: ''
                  });
                }
              );
              this.onMatchWithBasket(this.products)
            }, 10);

          }
          event.target.complete();
        },
        error: (error: ApiException) => {
          event.target.complete();
          // Manejar el error según sea necesario
        }
      });
    } else {
      event.target.complete();
    }

  }

  getAllProductsFilteres() {
    let categoryId: any = []

    if (this.selectedCategoryId === 0) {
      categoryId = []
    } else {
      categoryId = [this.selectedCategoryId]
    }
    this.productServiceProxy.getAll(this.searchValue, 1, 20, categoryId, this.arrayVariants, this.selectedMinPriceFiltered, this.selectedMaxPriceFiltered).subscribe({
      next: (response) => {
        this.page = 2
        this.mainInfo = {
          itemCount: response.meta.total,
          categoryCounts: this.onCalculateProductCounts(this.products),
        };
        this.searching = false

        const pageSize = 20; // Tamaño de página
        const totalProducts = response.meta.total; // Cantidad total de productos
        this.totalPages = Math.ceil(totalProducts / pageSize);
        setTimeout(() => {
          this.basketProductQuantity = [];
          this.products = response.data;
          this.products.forEach(
            (product) => {
              this.basketProductQuantity.push({
                productId: product.id,
                quantity: undefined,
                lastQuantity: ''
              });
            }
          );
          this.onMatchWithBasket(this.products)
        }, 10);

        if (response.data.length === 0) {
          this.noResultsMessageVisible = true;
          return
        }
      },
      error: (error) => {
        this.noResultsMessageVisible = true;
        this.searching = false
        return
      },
    });
  }


  loadMoreDataDestkop() {
    let categoryId: any = []
    if (this.selectedCategoryId === 0) {
      categoryId = []
    } else {
      categoryId = [this.selectedCategoryId]
    }
    if (this.page <= this.totalPages) {
      this.productServiceProxy.getAll(this.searchValue, this.page, 20, categoryId, this.arrayVariants, this.selectedMinPriceFiltered, this.selectedMaxPriceFiltered)
        .subscribe({
          next: (response) => {
            // Puedes hacer lo que necesites con los productos de la página actual aquí
            this.page++;
            this.products.push(...response.data);

            if (this.products.length != 0) {
              let featuredProductsBackup = [...this.products];
              // this.featuredProducts = [];
              setTimeout(() => {
                this.basketProductQuantity = [];
                this.products = featuredProductsBackup;
                this.products.forEach(
                  (product) => {
                    this.basketProductQuantity.push({
                      productId: product.id,
                      quantity: undefined,
                      lastQuantity: ''
                    });
                  }
                );
                this.onMatchWithBasket(this.products)
              }, 10);

            }
          },
          error: (error: ApiException) => {
            console.error(`Error en la página ${this.page}:`, error);
            // Manejar el error según sea necesario
          }
        });
    }
  }
}