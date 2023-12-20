import { Component, ElementRef, HostListener, Injector, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AppTabService, ViewComponent } from '@geor360/core';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { BasketService } from '@shared/services/basket.service';
import { ToolbarService } from '@shared/services/toolbar.service';
import { Observable, firstValueFrom } from 'rxjs';
import { HeaderDesktopService } from '../shared/services/header-desktop.service';
import { OrdersService } from './profile/orders/orders.service';
import { ConfigStoreService } from '@shared/services/config-store.service';

@Component({
  selector: 'app-ecommerce',
  templateUrl: 'ecommerce.component.html',
  styleUrls: ['ecommerce.component.scss'],
  host: { 'app.ecommerce': 'true' },
})
export class EcommerceComponent extends ViewComponent implements OnInit {

  private _authTokenService: AuthTokenService;
  private _basketService: BasketService;
  private _ordersService: OrdersService;
  private _configStore: ConfigStoreService; 

  @ViewChildren('item') items!: QueryList<ElementRef>;

  headerDesktopService: HeaderDesktopService;
  count$: Observable<number> | undefined;
  toolbar: AppTabService;
  toolbarService: ToolbarService;
  sizeScreenWidth: number = 0;
  showMore: boolean = false;
  routesTab = [
    '/app/ecommerce/home',
    '/app/ecommerce/categories',
    '/app/ecommerce/inbox',
    '/app/ecommerce/basket',
    '/app/ecommerce/profile'
  ];
  activated = [true, false, false, false, false];
  device: string = '';
  value: any;

  constructor(_injector: Injector, private router: Router,) {
    super(_injector);
    this._authTokenService = _injector.get(AuthTokenService);
    this._basketService = _injector.get(BasketService);
    this._ordersService = _injector.get(OrdersService);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
    this.toolbar = _injector.get(AppTabService);
    this.toolbarService = _injector.get(ToolbarService);
    this._configStore = _injector.get(ConfigStoreService);
    this.toolbar.show();
    this.device = this.configuration.screen();
    this._configStore.initTitle()
  }

  ionTabsDidChange() {
    this.activated.fill(false);
    const currentRoute = this.router.url;
    const index = this.findMatchingRouteIndex(currentRoute);
    if (index !== -1) {
      this.activated[index] = true;
    }
  }

  findMatchingRouteIndex(currentRoute: string) {
    for (let i = 0; i < this.routesTab.length; i++) {
      if (currentRoute.startsWith(this.routesTab[i])) {
        return i;
      }
    }
    return -1;
  }

  ngOnInit() {
   
    this.getScreenSize();
    this.value = this.headerDesktopService.getText();
    this.setOrdersCounter();
    this.count$ = this._basketService.getCount();
    
  }

  async setOrdersCounter() {
    try {
      const isAuthenticated = await firstValueFrom(this._authTokenService.isAuthenticated());
      if (!isAuthenticated) return;
      this._ordersService.setCounter();
    } catch (error) {
      console.error('Error setting orders counter', error);
    }

  }

  ngOnDestroy(): void {
    localStorage.setItem('isLogged', 'false');
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: Event) {
    this.sizeScreenWidth = window.innerWidth;
    this.changeScreen();
  }

  changeScreen() {
    if (this.sizeScreenWidth < 500) {
      this.showMore = true;
    }
    else {
      this.showMore = false;
    }
  }

  search(event: Event) {
    const inputEvent = event as InputEvent;
    if (inputEvent && inputEvent.target instanceof HTMLInputElement) {
      const text = inputEvent.target.value.toLowerCase().trim();
      this.headerDesktopService.updateValueInput(text);
    }
  }

  profilePopover(event: Event) {
    this.headerDesktopService.profilePopover(event);
  }
}
