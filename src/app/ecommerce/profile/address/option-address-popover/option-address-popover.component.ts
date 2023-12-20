import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';

@Component({
  templateUrl: 'option-address-popover.component.html',
  styleUrls: ['option-address-popover.component.scss'],
  host: { 'app.option-address-popover': 'true' }
})
export class OptionAddressPopoverComponent extends ViewComponent {

  private _popoverController: PopoverController;
  
  @Input() id: string = '';

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  selectOption(option: 'edit' | 'delete') {
    this._popoverController.dismiss({ option, id: this.id });
  }

}
