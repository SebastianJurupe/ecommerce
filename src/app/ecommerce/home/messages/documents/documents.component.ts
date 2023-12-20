import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';

@Component({

  templateUrl: 'documents.component.html',
  styleUrls: ['documents.component.scss'],
  host: { 'app.documents': 'true' }
})
export class DocumentsComponent extends ViewComponent {

  private _popoverController: PopoverController;

  @Input() documentTypeId: string = '';

  documentsArchive = [
    { name: this.localization.localize('home.message.image', 'ecommerce') },
    { name: this.localization.localize('home.message.archive', 'ecommerce') },
  ];
  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  selectDocumentType(documentType: string) {
    this._popoverController.dismiss(documentType);
  }
}
