import { Component, Injector } from '@angular/core';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { LoginTabletComponent } from 'src/app/ecommerce/profile/login';
import { InitialConfigComponent } from '../../initial-config/initial-config.component';
import { HomeBaseComponent } from '../base/home-base.component';


@Component({
  templateUrl: 'home-desktop.component.html',
  styleUrls: [
    'home-desktop.component.scss',
    '../base/home-base.component.scss'
  ],
  host: { 'app.home.home-desktop': 'true' }
})
export class HomeDesktopComponent extends HomeBaseComponent {

  private _animationModalService: AnimationModalService;

  headerDesktopService: HeaderDesktopService;
  scroll: boolean = true;
  loopCompleted: boolean = false;
  downloadAppbuttons = [
    {
      icon: 'icon--apple-brand',
      buttonClass: 'banner-dowload-button-ios',
      label: 'App Store',
    },
    {
      icon: 'icon--google-play-brand',
      label: 'Play Store',
      buttonClass: 'banner-dowload-button-android',
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
    this._animationModalService = _injector.get(AnimationModalService);
    this.showInitialConfigurationModal();
  }

  override ionViewWillEnter(): void {
    this.getStateLoged();
    this.getFeaturedCategoryDetails();

    if (this.featuredProducts.length != 0) {
      let featuredProductsBackup = [...this.featuredProducts];
      this.basketProductQuantity = [];
      this.featuredProducts = [];
      setTimeout(() => {
        this.featuredProducts = featuredProductsBackup;
        this.featuredProducts.forEach(
          (product) => {
            this.basketProductQuantity.push({
              productId: product.id,
              quantity: undefined,
              lastQuantity: ''
            });
          }
        );
        this.matchWithBasket(this.featuredProducts);
      }, 10);

    }
  }

  showInitialConfigurationModal() {
    const hasInitialConfig = localStorage.getItem('hasInitialConfig');
    if (hasInitialConfig) return;
    this.dialog.showWithData({
      component: InitialConfigComponent,
      componentProps: {
        usedAsModal: true,
      },
      cssClass: ['modal-custom', 'modal-custom--in-center-medium']
    }).then(response => {
      this.refreshPlaceholders();
      localStorage.setItem('hasInitialConfig', 'true');
    });
  }

  viewProductDetailDesktop(id: number, description: string) {
    const formattedDescription = description.replace(/\s+/g, '-');

    this.navigation.forwardNoAnimation(`/app/ecommerce/home/detail-product/${id}/${formattedDescription}`);
  }

  handleOffsetTop(offset: number, hasVariants: boolean) {
    if (offset !== 0 && !hasVariants) {
      this.content.scrollToPoint(0, offset - 300, 1000);
    }
  }

  ionViewDidEnter() {
    this.refreshPlaceholders();
    this.toolbar.show();
    this.getStateLoged();
    if (this.featuredProducts.length != 0) {
      let featuredProductsBackup = [...this.featuredProducts];
      this.basketProductQuantity = [];
      this.featuredProducts = [];
      setTimeout(() => {
        this.featuredProducts = featuredProductsBackup;
        this.featuredProducts.forEach(
          (product) => {
            this.basketProductQuantity.push({
              productId: product.id,
              quantity: undefined,
              lastQuantity: ''
            });
          }
        );
        this.matchWithBasket(this.featuredProducts);
      }, 10);
    }
  }

  async onClickShoppingCartDesktop(_index: number, productHasVariants: boolean, productId: number, description: string) {
    this.authTokenService.isAuthenticated()
      .subscribe(async (isAuthenticated) => {
        if (!isAuthenticated) {
          this.dialog
            .showWithData<"confirm" | undefined>({
              component: LoginTabletComponent,
              backdropDismiss: false,
              leaveAnimation: this._animationModalService.closeDesktopModal,
              cssClass: ['modal-custom', 'modal-custom--in-center-medium']
            });
        } else {
          if (!productHasVariants) {
            this.showMenuInput = true;
          } else {
            this.viewProductDetailDesktop(productId, description);
          }
        }
      });
  }

  async clickInputCartShoppingDesktop(_index: number) {
    if (this.userIsAuthenticated) {
      this.showMenuInput = true;
    } else {
      this.dialog
        .showWithData<"confirm" | undefined>({
          component: LoginTabletComponent,
          backdropDismiss: false,
          leaveAnimation: this._animationModalService.closeDesktopModal,
          cssClass: ['modal-custom', 'modal-custom--in-center-medium']
        });
    }
  }


}