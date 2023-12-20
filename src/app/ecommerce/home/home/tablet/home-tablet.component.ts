import { Component, Injector } from '@angular/core';
import { HomeBaseComponent } from '../base/home-base.component';
import { PopoverController } from '@ionic/angular';
import { HomeTabletComponent as HomeTabletComponentPopover } from 'src/app/ecommerce/categories/home';
import { MenuComponent } from '../../modals/menu/menu.component';
import { LoginTabletComponent } from 'src/app/ecommerce/profile/login';
@Component({
  templateUrl: 'home-tablet.component.html',
  styleUrls: [
    'home-tablet.component.scss',
    './../base/home-base.component.scss'
  ],
  host: { 'app.home.home-tablet': 'true' }
})
export class HomeTabletComponent extends HomeBaseComponent {

  private _popoverController: PopoverController;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  async searchPopover(event: Event) {
    const popover = await this._popoverController.create({
      component: HomeTabletComponentPopover,
      event: event,
      alignment: 'center',
      arrow: false,
      dismissOnSelect: false,
      size: 'cover',
    });

    await popover.present();
  }

  async profilePopover() {
    this.dialog
      .showWithData<"confirm" | undefined>({
        component: LoginTabletComponent,
        cssClass: ['modal-custom', 'modal-custom--in-center-medium']
      })

  }

  viewBasket() {
    this.navigation.forward('/app/ecommerce/basket/home');
  }

  test(event: any) {
  }

  close() {
  }

  inboxClick() {
    // this.navigation.back('/app/ecommerce/inbox');
  }

  viewMenu() {
    this.dialog.showWithData<'cancel' | undefined>({
      component: MenuComponent,
    });
  }

}