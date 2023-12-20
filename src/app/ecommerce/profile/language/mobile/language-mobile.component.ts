import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'language-mobile.component.html',
  styleUrls: ['language-mobile.component.scss'],
  host: { 'app.language-mobile': 'true' }
})
export class LanguageMobileComponent extends ViewComponent {

  selectedlanguage: string;
  languages = {
    spanish: this.localization.localize('profile.language.spanish', 'ecommerce'),
    english: this.localization.localize('profile.language.english', 'ecommerce')
  };

  constructor(_injector: Injector) {
    super(_injector);
    this.selectedlanguage = this.localization.currentLanguage;
  }

  setLanguage(option: 'en_US' | 'es_ES') {
    this.localization.changeLanguage(option);
    this.refreshPlaceholders();

    this.navigation.forward('/app/ecommerce/profile/setting');
  }

  refreshPlaceholders() {
    this.languages = {
      spanish: this.localization.localize('profile.language.spanish', 'ecommerce'),
      english: this.localization.localize('profile.language.english', 'ecommerce')
    };
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/setting');
  }
}
