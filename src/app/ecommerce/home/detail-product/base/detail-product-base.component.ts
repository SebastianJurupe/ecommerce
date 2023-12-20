import { Component, ElementRef, Injector, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { NavController, PopoverController } from '@ionic/angular';
import { ProductGetDetailsDataDto, ProductServiceProxy } from '@shared/proxies/home/product.proxie';
import { FavoriteServiceProxy } from '@shared/proxies/profile/favorites.proxie';
import { ShippingServiceProxy, ShippingType } from '@shared/proxies/public/shipping.proxie';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { BasketService } from '@shared/services/basket.service';
import { Observable } from 'rxjs';
import { Address, AddressService } from 'src/app/ecommerce/profile/address/services/address.service';
import { FavoritesService } from 'src/app/ecommerce/profile/favorites/favorites.service';
import { Especification } from '../../detail/base/detail-base.component';
import { ImageProductCompleteMobileComponent } from '../../modals/image-product-complete';
import { ShareComponent } from '../../modals/share/share.component';
import { FreightForwardersMobileComponent, HomeDeliveryMobileComponent, StoresMobileComponent } from '@shared/components';

export interface DeliveryTypeOption {
  code: ShippingType;
  icon: string;
  description: string;
}

@Component({
  templateUrl: 'detail-product-base.component.html',
  styleUrls: ['detail-product-base.component.scss'],
  host: { 'app.detail-product-base': 'true' }
})
export class DetailProductBaseComponent extends ViewComponent implements OnInit {

  private _activateRoute: ActivatedRoute;
  private _addressService: AddressService;
  private _authTokenService: AuthTokenService;
  private _basketService: BasketService;
  private _favoriteServiceProxy: FavoriteServiceProxy;
  private _favoritesService: FavoritesService;
  private _navController: NavController;
  private _popoverController: PopoverController;
  private _shippingServiceProxy: ShippingServiceProxy;
  private _toolbar: AppTabService;

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  count$: Observable<number> | undefined;
  attributeVariants: any[] = [];
  deliveryTypes: DeliveryTypeOption[] = [];
  details: WritableSignal<Especification[]> = signal([]);
  isFavorite: boolean = false;
  isLoading: boolean = false;
  isTypesHidden = true;
  product: ProductGetDetailsDataDto = new ProductGetDetailsDataDto();
  productId: string = '';
  productDescription: string = '';
  productServiceProxy: ProductServiceProxy;
  selectedProductIndex = -1;
  showDetailComponent: boolean = false;
  totalItems: number = 0;
  animationModalService: AnimationModalService;
  url: string = '';
  addToFavoriteLoading: boolean = false;
  isAuthenticated: boolean = false;
  filteredAttributes: string[] = [];
  selectAddressOption: Address = {
    id: 0,
    address: '',
    country: '',
    default: false,
    description: '',
    extra: [],
    postal_code: ''
  };

  constructor(_injector: Injector) {
    super(_injector);
    this._addressService = _injector.get(AddressService);
    this._activateRoute = _injector.get(ActivatedRoute);
    this._authTokenService = _injector.get(AuthTokenService);
    this._favoriteServiceProxy = _injector.get(FavoriteServiceProxy);
    this._favoritesService = _injector.get(FavoritesService);
    this._navController = _injector.get(NavController);
    this.productServiceProxy = _injector.get(ProductServiceProxy);
    this._shippingServiceProxy = _injector.get(ShippingServiceProxy);
    this._basketService = _injector.get(BasketService);
    this._toolbar = _injector.get(AppTabService);
    this._popoverController = _injector.get(PopoverController);
    this.animationModalService = _injector.get(AnimationModalService);
  }

  async ngOnInit() {
    this.url = window.location.pathname;
    const { id, description } = this._activateRoute.snapshot.params;
    this.productId = id;
    this.productDescription = description;
    if (id === null || id === undefined || +id === 0) { this.navigation.back('/app/ecommerce/home'); }
    if (id !== null && id !== undefined) { this.getProductDetails(id); }
    this.isAuthenticated = await this.checkIfIsAuthenticated();
    this.getDeliveryTypes();
    if (this.isAuthenticated) {
      this._addressService.getAll();
      this.checkIfIsFavorited();
    }
    this.count$ = this._basketService.getCount();
    console.log()
  }

  ionViewWillEnter() {
    this._toolbar.hide();
    this.getTotalItems();
  }

  getDeliveryTypes() {
    this._shippingServiceProxy.getAllAvailables().subscribe({
      next: (res) => {
        const data = res.data.map((item: any) => ({ ...item, icon: '' }));
        if (data.length >= 3) {
          data[0].icon = 'icon icon--location';
          data[1].icon = 'icon icon--truck';
          data[2].icon = 'icon icon--store';
        }
        this.deliveryTypes = data;
      },
      error: (err: ApiException) => { this.message.exception(err); }
    });
  }

  async goTodeliveryTypeMethod(deliveryType: DeliveryTypeOption) {
    if (!this.isAuthenticated) {
      this.navigation.forward('/app/ecommerce/profile/login');
      return;
    }
    switch (deliveryType.code) {
      case 'AGENCIA':
        this.dialog.showWithData({
          component: FreightForwardersMobileComponent,
          componentProps: {
            id: this.productId,
            productDescription: this.productDescription,
            selectAddressOption: this.selectAddressOption
          },
        }).then((res: any) => {
          if (res.data.result !== 'cancel') {
            this.selectAddressOption = res.data.result.address
          }
        });
        break;
      case 'DOMICILIO':
        this.dialog.showWithData({
          component: HomeDeliveryMobileComponent,
          componentProps: {
            id: this.productId,
            productDescription: this.productDescription,
            selectAddressOption: this.selectAddressOption
          },
        }).then((res: any) => {
          if (res.data.result !== 'cancel') {
            this.selectAddressOption = res.data.result.address
          }
        });
        break;
      case 'TIENDA':
        this.dialog.showWithData({
          component: StoresMobileComponent,
          componentProps: {
            id: this.productId,
            productDescription: this.productDescription,
            selectAddressOption: this.selectAddressOption
          },
        }).then((res: any) => {
          if (res.data.result !== 'cancel') {
            this.selectAddressOption = res.data.result.address
          }
        });
        break;
    }
  };

  getProductDetails(id: number) {
    this.isLoading = true;
    this.productServiceProxy.getProductsDetail(id)
      .subscribe({
        next: (response) => {
          this.product = response.data;
          this.getProductSpecifications(response);
          this.getUniqAttributes(this.product.variants);
          this.getAttributeVariants(this.product.variants);
          this.isLoading = false;

          if (response.data.files.length === 0) {
            const imageNotFound = {
              id: 1,
              description: 'not found',
              is_cover: false,
              path: 'assets/images/product-empty.jpg',
            };
            this.product.files = [imageNotFound];
          }

          if (response.data.files.length <= 0) {
            this.selectedProductIndex = -1;
          } else {
            this.selectedProductIndex = 0;
          }
        },
        error: (error: ApiException) => {
          this.isLoading = false;
          this.message.exception(error);
        },
      });
  }

  getProductSpecifications(response: any) {
    const { has_variants, internal_id, stock, variants } = response.data;
    const fomarttedStock = has_variants ? this.calculateProductWithVariantsStock(variants) : stock;
    const sku = { specification: 'SKU', value: internal_id };
    const stockDetail = { specification: 'Stock', value: `${fomarttedStock} ${response.data.unit_type.description}` };
    const details = [...response.data.specifications, stockDetail, sku];
    this.isLoading = false;
    this.details.set(details);
  }

  calculateProductWithVariantsStock(variants: any[]): number {
    return variants.reduce((acc: number, variant: any) => acc + variant.stock, 0);
  }

  selectProduct(index: number) {
    this.swiperContainer.nativeElement.allowSlideNext = true;
    this.swiperContainer.nativeElement.allowSlidePrev = true;
    this.swiperContainer.nativeElement.allowTouchMove = true;
    this.selectedProductIndex = index;
    if (this.swiperContainer && this.swiperContainer.nativeElement.swiper) {
      this.swiperContainer.nativeElement.swiper.slideTo(index);
    }
  }

  toggleTypesVisibility() {
    this.isTypesHidden = !this.isTypesHidden;
  }

  async share() {
    await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: 'https://geor.app/',
      dialogTitle: '',
    });
  }

  async shareProduct(event: Event) {
    const popover = await this._popoverController.create({
      component: ShareComponent,
      event: event,
      alignment: 'start',
      mode: 'ios',
      size: 'cover',
      arrow: false,
      dismissOnSelect: true,
      cssClass: ['share-product-desktop'],
      componentProps: {
        path: this.url
      }
    });

    await popover.present();
  }

  getUniqAttributes(data: any[]) {
    const attributes = data.map(variant => variant.values.find((value: any) => value.attribute));
    const uniqAttributes = [...new Set(attributes.map(item => item.attribute))];
    this.filteredAttributes = uniqAttributes;
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

  async openVariants(id: number, description: string) {
    if (!this.isAuthenticated) {
      return this.navigation.forward('/app/ecommerce/profile/login');
    } else {
      const formattedDescription = description.replace(/\s+/g, '-');

      this.goTodeliveryToUrl(`/app/ecommerce/home/variants/${id}/${formattedDescription}`);
    }
  }

  goToChat() {
    // this.navigation.forward('/app/ecommerce/inbox/home');
  }

  navigateToReturns() {
    this.navigation.forward('/app/ecommerce/profile/exchanges-returns');
  }

  goToDetails(id: number, description: string) {
    const formattedDescription = description.replace(/\s+/g, '-');
    this.navigation.forward(`/app/ecommerce/home/detail/${id}/${formattedDescription}`);
  }

  async goTodeliveryToUrl(destinationUrl: string) {
    if (!this.isAuthenticated) {
      this.navigation.forward('/app/ecommerce/profile/login');
    }

    this.navigation.forward(destinationUrl);
  }

  goToBasket(id: number) {
    this.navigation.forward('app/ecommerce/basket', { path: `detail-product/${id}` });
  }

  openImgProduct() {
    this.dialog.showWithData({
      component: ImageProductCompleteMobileComponent,
      cssClass: ['modal-custom', 'modal-custom--full'],
    });
  }

  async checkIfIsFavorited() {
    if (!this.isAuthenticated) { return; }
    this._favoriteServiceProxy.getAll()
      .subscribe({
        next: (res) => {
          const favorites = res.data;
          this.isFavorite = favorites.find((product: any) => product.id === +this.productId);
        },
        error: (err) => console.error(err)
      });
  }

  async addToFavorites() {
    if (!this.isAuthenticated) {
      return this.navigation.forward('/app/ecommerce/profile/login');
    } else {
      this.addToFavoriteLoading = true;
      this._favoriteServiceProxy.register(this.product.id)
        .subscribe({
          next: async () => {
            this.addToFavoriteLoading = false;
            this.isFavorite = true;
            this.notify.success('Producto añadido a favoritos correctamente', 1000);
            await this._favoritesService.getAll();
          },
          error: (error: ApiException) => {
            this.addToFavoriteLoading = false;
            this.message.exception(error);
            this.isFavorite = false;
          },
        });
    }
  }

  async deleteFavorite() {
    if (!this.isAuthenticated) {
      this.navigation.forward('/app/ecommerce/profile/login');
      return;
    } else {
      this._favoriteServiceProxy.delete(this.product.id)
        .subscribe({
          next: async () => {
            this.isFavorite = false;
            await this._favoritesService.getAll();
          },
          error: (error: ApiException) => {
            this.message.exception(error);
          },
        });
    }
  }

  checkIfIsAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this._authTokenService.isAuthenticated()
        .subscribe({
          next: (isAuthenticated: boolean) => {
            resolve(isAuthenticated);
          },
          error: (error) => {
            console.error(error);
            resolve(false);
          }
        });
    });
  }

  getTotalItems() {
    this.totalItems = this._basketService.getTotalItems();
  }

  onBackButtonPressed() {
    const { fromBanner, categories, fromFilter } = this._activateRoute.snapshot.queryParams;

    if (fromBanner !== undefined || categories !== undefined || fromFilter) {
      this._navController.back({ animated: true });
    } else {
      this.navigation.back('app/ecommerce/home/home');
    }
    this._toolbar.show();
  }
}