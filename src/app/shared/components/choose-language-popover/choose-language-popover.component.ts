import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';

type Language = 'es_ES' | 'en_US';

interface LanguageOption {
  id: string;
  label: string;
  code: Language;
}

@Component({
  templateUrl: 'choose-language-popover.component.html',
  styleUrls: ['choose-language-popover.component.scss'],
  host: { 'app.choose-language-popover': 'true' }
})
export class ChooseLanguagePopoverComponent extends ViewComponent {

  private _popoverController: PopoverController;

  @Input() code!: Language;

  options: LanguageOption[] = [
    {
      id: '01',
      label: this.localization.localize('general.spanish', 'ecommerce'),
      code: 'es_ES'
    },
    {
      id: '02',
      label: this.localization.localize('general.english', 'ecommerce'),
      code: 'en_US'
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  selectLanguage(option: LanguageOption) {
    this._popoverController.dismiss(option);
  }
}