import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';

@Component({
  templateUrl: 'document-types-popover.component.html',
  styleUrls: ['document-types-popover.component.scss'],
  host: { 'app.document-types-popover': 'true' }
})
export class DocumentTypesPopoverComponent extends ViewComponent {

  private _popoverController: PopoverController;

  @Input() documentTypeId: string = '';

  documentTypes = [
    {
      id: '01',
      name: this.localization.localize("profile.bookOfClaims.docIdentification.dni", "ecommerce"),
    },
    {
      id: '02',
      name:  this.localization.localize("profile.bookOfClaims.docIdentification.passport", "ecommerce"),
    },
    {
      id: '03',
      name: this.localization.localize("profile.bookOfClaims.docIdentification.mmigrationCard", "ecommerce")
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
  }

  selectDocumentType(documentType: { id: string, name: string; }) {
    this._popoverController.dismiss(documentType);
  }
}