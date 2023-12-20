import { Component, Injector } from '@angular/core';
import { HeaderDesktopService } from '@shared/services/header-desktop.service';
import { FavoritesBaseComponent } from '../base/favorites-base.component';

@Component({
  templateUrl: 'favorites-desktop.component.html',
  styleUrls: ['favorites-desktop.component.scss'],
  host: { 'app.favorites-desktop': 'true' }
})
export class FavoritesDesktopComponent extends FavoritesBaseComponent {

  headerDesktopService: HeaderDesktopService;

  constructor(_injector: Injector) {
    super(_injector);
    this.headerDesktopService = _injector.get(HeaderDesktopService);
  }

  override ionViewWillEnter() {
    this.toolbar.show();
  }

}
