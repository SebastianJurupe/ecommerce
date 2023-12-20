import { Component, Injector } from '@angular/core';
import { ChangeModeBaseComponent } from '../base/change-mode-base.component';
import { PopoverController } from '@ionic/angular';

interface ModeLabels {
  [key: number]: string;
}
@Component({
  templateUrl: 'change-mode-tablet.component.html',
  styleUrls: ['change-mode-tablet.component.scss'],
  host: { 'app.change-mode-tablet': 'true' }
})

export class ChangeModeTabletComponent extends ChangeModeBaseComponent {

  private _popoverController: PopoverController;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);

  }

  selectMode(value: number) {
    const modeLabels: ModeLabels = {
      1: 'automatic',
      2: 'light',
      3: 'dark',
    };

    const textLabel = this.localization.localize(`profile.changeMode.${modeLabels[value]}`, 'ecommerce');

    this._popoverController.dismiss(textLabel);
  }
}
