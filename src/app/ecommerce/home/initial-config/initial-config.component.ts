import { Component, Injector, Input } from '@angular/core';
import { AppConfigurationService, AppTabService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter } from '@ionic/angular';
import { ModalCountryComponent } from 'src/app/shared/components';
import { ChooseLanguagePopoverComponent } from '../../../shared/components/choose-language-popover/choose-language-popover.component';

interface Country {
  id: string;
  description: string;
  default: boolean;
  code: string;
  mask: string;
  flag: string;
}

@Component({
  templateUrl: 'initial-config.component.html',
  styleUrls: ['initial-config.component.scss'],
  host: { 'app.initial-config': 'true' }
})
export class InitialConfigComponent extends ViewComponent implements ViewWillEnter {

  private _appConfigurationService: AppConfigurationService;
  private _toolbar: AppTabService;
  private _popoverController: PopoverController;

  @Input() usedAsModal: boolean = false;
  @Input() selectedLanguage: 'en_US' | 'es_ES' = 'es_ES';
  @Input() country?: Country = {
    id: 'PE',
    description: 'Perú',
    default: true,
    code: '+51',
    mask: '999 999 999',
    flag: 'https://geor-aplicaciones-demo.geor.io/images/pe.svg'
  };

  placeholders: { [key: string]: string; } = {};

  constructor(_injector: Injector) {
    super(_injector);
    this._appConfigurationService = _injector.get(AppConfigurationService);
    this._popoverController = _injector.get(PopoverController);
    this._toolbar = _injector.get(AppTabService);
    this.selectedLanguage = this.localization.currentLanguage;
    this.refreshPlaceholders();
  }

  get isMobile() {
    return this._appConfigurationService.screen() === 'mobile';
  }

  get countriesModalClass(): string[] {
    return this._appConfigurationService.screen() === 'mobile'
      ? ['modal-custom', 'modal-custom--full']
      : ['modal-custom', 'modal-custom--in-center-medium'];
  }

  ionViewWillEnter() {
    this.isMobile && this._toolbar.hide();
  }

  confirm() {
    if (this.usedAsModal) {
      this.dialog.dismiss({ language: this.selectedLanguage, country: this.country });
    } else {
      this.navigation.forward('/app/ecommerce/home/home');
    }
  }

  openCountriesModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      componentProps: {
        title: 'País',
        countryId: this.country?.id,
        countryCode: this.country?.id
      },
      cssClass: this.countriesModalClass
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
      alignment: 'end',
      size: 'auto',
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
    this.refreshPlaceholders();
  }

  refreshPlaceholders() {
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
