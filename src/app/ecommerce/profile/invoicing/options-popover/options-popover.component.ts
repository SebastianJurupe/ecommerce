import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';

@Component({
  templateUrl: 'options-popover.component.html',
  styleUrls: ['options-popover.component.scss'],
  host: { 'app.options-popover': 'true' }
})
export class OptionsPopoverComponent extends ViewComponent {

  @Input() id!: number;

  private _popoverController: PopoverController;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  selectOption(option: 'edit' | 'delete') {
    this._popoverController.dismiss({ id: this.id, option: option });
  }
}