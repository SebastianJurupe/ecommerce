import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: 'share.component.html',
  styleUrls: ['share.component.scss'],
  host: { 'app.share': 'true' }
})
export class ShareComponent extends ViewComponent {

  @Input() path: string = ``;

  baseUrl: string = environment.baseUrl;
  iconSocial = [
    {
      classIcon: 'icon icon--instagram-white icon--20',
      method: () => { }
    },
    {
      classIcon: 'icon icon--facebook-white icon--20',
      method: () => { }
    },
    {
      classIcon: 'icon icon--youtube-white icon--20',
      method: () => { }
    },
    {
      classIcon: 'icon icon--twitter-white icon--20',
      method: () => { }
    },
    {
      classIcon: 'icon icon--linkedin-white icon--20',
      method: () => { }
    }
  ];

  constructor(_injector: Injector) {
    super(_injector);
  }

  get formattedPath() {
    return `${this.baseUrl}${this.path}`;
  }

  copy() {
    try {
      if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(this.formattedPath);
      }
      this.notify.success('Copiado correctamente', 2500);
    } catch (error) {
      throw new Error(error as string);
    }
  }

}
