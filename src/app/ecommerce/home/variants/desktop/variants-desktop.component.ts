import { Component, Injector} from '@angular/core';
import { VariantsBaseComponent } from '../base/variants-base.component';
import { PopoverController } from '@ionic/angular';
import { ShareComponent } from '../../modals/share/share.component';

@Component({
  selector: 'variants-desktop',
  templateUrl: 'variants-desktop.component.html',
  styleUrls: ['variants-desktop.component.scss'],
  host: { 'app.variants-desktop': 'true' }
})
export class VariantsDesktopComponent extends VariantsBaseComponent{

  private _popoverController: PopoverController;

  constructor(_injector:Injector){
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  async shareProduct(event:Event){
    const popover = await this._popoverController.create({
      component: ShareComponent,
      event: event,
      alignment: 'start',
      mode: 'ios',
      size: 'cover',
      arrow: false,
      dismissOnSelect: true,
      cssClass: ['share-product-desktop']
    });

    await popover.present();
  }
}
