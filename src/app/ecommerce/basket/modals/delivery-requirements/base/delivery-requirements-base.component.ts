import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'delivery-requirements-base.component.html',
  styleUrls: ['delivery-requirements-base.component.scss'],
  host: { 'app.delivery-requirements-base': 'true' }
})
export class DeliveryRequirementsBaseComponent extends ViewComponent {

  textAreaContent: string = '';
  @Input() nameRequirement: string = ''
  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() {
    this.textAreaContent = this.nameRequirement
  }

  save() {
    this.dialog.dismiss(this.textAreaContent.valueOf())
  }

  close() {
    this.dialog.dismiss('cancel');
  }

  textAreaContentIsValid(): boolean {
    return this.textAreaContent.trim() !== '';
  }
}