import { Component, Injector } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { PopoverController, ViewWillEnter } from '@ionic/angular';
import { DocumentsComponent } from '../documents/documents.component';

@Component({
  templateUrl: 'messages-mobile.component.html',
  styleUrls: ['messages-mobile.component.scss'],
  host: { 'app.messages-mobile': 'true' }
})
export class MessagesMobileComponent extends ViewComponent implements ViewWillEnter {

  private _toolbar: AppTabService;
  private _popoverController: PopoverController;
  showImageSection: boolean = false;

  document = {
    name: '',
  };

  titleLine = 'Chompa de lana de alpaca peruana nacionalizada alemana con raises asiaticas';
  showOptionsMore = false;
  showContentOverlay = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
    this._toolbar = _injector.get(AppTabService);
  }

  ionViewWillEnter(): void {
    this._toolbar.hide();
  }
  toggleImageSection() {
    this.showImageSection = !this.showImageSection;
  }

  async openDocumentTypesPopover(event: any) {
    const popover = await this._popoverController.create({
      component: DocumentsComponent,
      event: event,
      alignment: 'end',
      arrow: false,
      dismissOnSelect: true,
      componentProps: {
        documentTypeId: this.document.name
      },
      cssClass: ['documents']
    });

    await popover.present();

  }

  sendMessage(value: any) {
    
  }

  more() {
    this.showOptionsMore = !this.showOptionsMore;
    this.showContentOverlay = this.showOptionsMore;
  }

  open() {
    window.open('tel:+51927686869');
  }

  openInside() {
    this.navigation.back('app/ecommerce/inbox/inside-multimedia');
  }

  goBack() {
    this.navigation.back('app/ecommerce/home/detail-product');
  }
}
