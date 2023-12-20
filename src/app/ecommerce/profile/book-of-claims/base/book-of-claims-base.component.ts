import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'book-of-claims-base.component.html',
  styleUrls: ['book-of-claims-base.component.scss'],
  host: { 'app.book-of-claims-base': 'true' }
})
export class BookOfClaimsBaseComponent extends ViewComponent  {

  registeredClaim: boolean = false;
  claim = {
    full_name: '',
    document: {
      type: {
        prefix: this.localization.localize("profile.bookOfClaims.docIdentification.dni", "ecommerce"),
        id: '01',
      },
      document_number: '',
    },
    email: '',
    phone: '',
    address: '',
    department: '',
    province: '',
    district: '',
    description: ''
  };
  isLoading: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
  }
}