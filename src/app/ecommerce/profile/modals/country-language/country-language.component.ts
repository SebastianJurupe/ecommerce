import { Component, Injector } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter } from '@ionic/angular';
import { ChooseLanguagePopoverComponent, ModalCountryComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-country-language',
  templateUrl: 'country-language.component.html',
  styleUrls: ['country-language.component.scss'],
  host: { 'app.country-language': 'true' }
})
export class CountryLanguageComponent extends ViewComponent implements ViewWillEnter {

  private _toolbar: AppTabService;
  private _popoverController: PopoverController;

  country = {
    id: 'PE',
    description: 'Perú',
    default: true,
    code: '+51',
    mask: '999 999 999',
    flag: 'https://geor-aplicaciones-demo.geor.io/images/pe.svg'
  };

  selectedLanguage: 'en_US' | 'es_ES';
  placeholders: any;

  constructor(_injector: Injector) {
    super(_injector);
    this.selectedLanguage = this.localization.currentLanguage;
    this._toolbar = _injector.get(AppTabService);
    this._popoverController = _injector.get(PopoverController);
    this.setPlaceholders();
  }

  ionViewWillEnter() {
    this._toolbar.hide();
  }

  dismiss() {
    this.dialog.dismiss('cancel');
  }


  openCountriesModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryId: this.country.id,
        countryCode: this.country.id
      },
      cssClass: ['modal-custom', 'modal-custom--full']
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }

  async chooseLanguagePopover(event: Event) {
    const popover = await this._popoverController.create({
      component: ChooseLanguagePopoverComponent,
      event: event,
      arrow: false,
      side: 'top',
      componentProps: {
        code: this.selectedLanguage
      },
      cssClass: ['choose-language-popover-initial-config']
    });

    await popover.present();

    const res = await popover.onDidDismiss();

    if (res.data) {
      const { code } = res.data;
      this.selectedLanguage = code;
      this.setLanguage(code);
    }
  }

  setLanguage(option: 'en_US' | 'es_ES') {
    this.selectedLanguage = option;
    this.localization.changeLanguage(option);
    this.setPlaceholders();
  }

  setPlaceholders() {
    this.placeholders = {
      welcome: this.localization.localize('home.initialConfigModal.welcome', 'ecommerce'),
      welcomeLabel: this.localization.localize('home.initialConfigModal.welcomeLabel', 'ecommerce'),
      confirm: this.localization.localize('home.initialConfigModal.confirm', 'ecommerce'),
      country: this.localization.localize('home.initialConfigModal.country', 'ecommerce'),
      language: this.localization.localize('home.initialConfigModal.language', 'ecommerce'),
      preferencesLabel: this.localization.localize('home.initialConfigModal.preferencesLabel', 'ecommerce'),
      spanish: this.localization.localize('home.initialConfigModal.spanish', 'ecommerce'),
      english: this.localization.localize('home.initialConfigModal.english', 'ecommerce'),
    };
  }
}
