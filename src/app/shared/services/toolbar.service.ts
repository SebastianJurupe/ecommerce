import { Injectable } from '@angular/core';
import { AppLocalizationService } from '@geor360/core';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  localization: AppLocalizationService = new AppLocalizationService();

  tabs: string[] = [
    this.localization.localize('toolbar.home', 'ecommerce'),
    this.localization.localize('toolbar.categories', 'ecommerce'),
    this.localization.localize('toolbar.inbox', 'ecommerce'),
    this.localization.localize('toolbar.basket', 'ecommerce'),
    this.localization.localize('toolbar.profile', 'ecommerce'),
  ];

  updateTranslations() {
    this.tabs = [
      this.localization.localize('toolbar.home', 'ecommerce'),
      this.localization.localize('toolbar.categories', 'ecommerce'),
      this.localization.localize('toolbar.inbox', 'ecommerce'),
      this.localization.localize('toolbar.basket', 'ecommerce'),
      this.localization.localize('toolbar.profile', 'ecommerce'),
    ];
  }


}
