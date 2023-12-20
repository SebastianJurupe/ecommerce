import { Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { LoginTabletComponent } from 'src/app/ecommerce/profile/login';
import { BarProductsBaseComponent } from '../base/bar-products-base.component';

@Component({
  templateUrl: 'bar-products-desktop.component.html',
  styleUrls: [
    'bar-products-desktop.component.scss',
    '../base/bar-products-base.component.scss'
  ],
  host: { 'app.bar-products-desktop': 'true' }
})
export class BarProductsDesktopComponent extends BarProductsBaseComponent implements ViewWillEnter {

  private _activatedRoute: ActivatedRoute;
  private _animationModalService: AnimationModalService;

  @ViewChild('content', { static: true }) content!: IonContent;

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this._activatedRoute = _injector.get(ActivatedRoute);
    this._animationModalService = _injector.get(AnimationModalService);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  override ionViewWillEnter() {
    this.toolbar.show();
  }

  onBackButtonPressed() {
    const { path } = this._activatedRoute.snapshot.queryParams;

    if (path) {
      this.navigation.back(`/app/ecommerce${path}`);
    } else {
      this.navigation.back('/app/ecommerce/home/home');
    }
  }

  navigateToHome() {
    this.navigation.back('/app/ecommerce/home/home');
  }

  navigateToBasket() {
    this.navigation.forward('/app/ecommerce/basket/home');
  }

  navigateToInbox() {
    // this.navigation.back('/app/ecommerce/inbox');
  }

  onOpenMenu() {
    this.headerDesktopService.viewMenu();
  }

  onOpenProfilePopover(event: Event) {
    this.headerDesktopService.profilePopover(event);
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
            this.onViewProductDetailDesktop(productId, description);
          }
        }
      });
  }


  async onClickInputCartShoppingDesktop(_index: number) {
    if (this.userIsAuthenticated) {
      this.showMenuInput = false;
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

  onViewProductDetailDesktop(id: number, description: string) {
    const formattedDescription = description.replace(/\s+/g, '-');
    this.navigation.forwardNoAnimation(`/app/ecommerce/home/detail-product/${id}/${formattedDescription}`);
  }


}
