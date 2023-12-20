import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'national-division-modal.component.html',
  styleUrls: ['national-division-modal.component.scss'],
  host: { 'app.national-division-modal': 'true' }
})
export class NationalDivisionModalComponent extends ViewComponent {

  @Input() data: any;
  @Input() selectedId: string = '';
  @Input() title:string =''

  searchText: string = '';

  constructor(_injector: Injector) {
    super(_injector);
  }

  search(filterValue: string) {
    this.searchText = filterValue;
  }

  select(item: any) {
    this.dialog.dismiss(item);
  }

  clearInput() {
    this.search('');
  }

  back() {
    this.dialog.dismiss('cancel');
  }
}