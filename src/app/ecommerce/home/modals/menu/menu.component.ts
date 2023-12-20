import { Component, Injector } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';
import { ChooseLanguagePopoverComponent, ModalCountryComponent } from '@shared/components';
import { AnimationModalService } from '@shared/services/animation-modal.service';
import { AuthTokenService } from '@shared/services/auth-token.service';
import { LoginTabletComponent } from 'src/app/ecommerce/profile/login';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
})
export class MenuComponent extends ViewComponent {

  private _popoverController: PopoverController;
  private _animationModalService: AnimationModalService;
  authTokenService: AuthTokenService;
  userIsAuthenticated: boolean = false;
  selectedLanguage: 'en_US' | 'es_ES';
  placeholders: any = [];
  iconSocial = [
    {
      classIcon: 'icon icon--instagram-white icon--20',
      method: () => window.open('https://www.instagram.com/renacperu/?igshid=M2RkZGJiMzhjOQ%3D%3D', '_blank')
    },
    {
      classIcon: 'icon icon--facebook-white icon--20',
      method: () => window.open('https://www.facebook.com/renacperu?mibextid=ZbWKwL', '_blank')
    },
    {
      classIcon: 'icon icon--tiktok icon--32',
      method: () => window.open('https://www.tiktok.com/@renacperu?_t=8hm4sPSO02g&_r=1', '_blank')
    },
    // {
    //   classIcon: 'icon icon--youtube-white icon--20',
    //   method: () => this.navigation.forward('')
    // }
    // ,
    // {
    //   classIcon: 'icon icon--twitter-white icon--20',
    //   method: () => this.navigation.forward('')
    // }
    // ,
    // {
    //   classIcon: 'icon icon--linkedin-white icon--20',
    //   method: () => this.navigation.forward('')
    // }
  ];
  country = {
    id: "PE",
    description: "Perú",
    default: true,
    code: "+51",
    mask: "999 999 999",
    flag: "https://geor-aplicaciones-demo.geor.io/images/pe.svg"
  };

  constructor(_injector: Injector) {
    super(_injector);
    this._popoverController = _injector.get(PopoverController);
    this.selectedLanguage = this.localization.currentLanguage;
    this._animationModalService = _injector.get(AnimationModalService);
    this.authTokenService = _injector.get(AuthTokenService);

    this.setPlaceholders();
    this.getStateLoged();

  }

  async chooseLanguagePopover(event: Event) {
    const popover = await this._popoverController.create({
      component: ChooseLanguagePopoverComponent,
      event: event,
      arrow: false,
      side: 'top',
      componentProps: {
        code: this.selectedLanguage
      },
      cssClass: ['choose-language-popover-login']
    });
    await popover.present();
    const res = await popover.onDidDismiss();
    if (res.data) {
      const { code } = res.data;
      this.selectedLanguage = code;
      this.setLanguage(code);
      window.location.reload();
    }
  }

  setLanguage(option: 'en_US' | 'es_ES') {
    this.selectedLanguage = option;
    this.localization.changeLanguage(option);
    this.setPlaceholders();
  }

  setPlaceholders() {
    this.placeholders = {
      help: this.localization.localize('profile.help.title', 'ecommerce'),
      bookOfClaims: this.localization.localize('profile.help.bookOfClaims', 'ecommerce'),
      talkToSales: this.localization.localize('profile.help.talkToSales', 'ecommerce'),
      aboutTitle: this.localization.localize('profile.about.title', 'ecommerce'),
      about: this.localization.localize('profile.about.about', 'ecommerce'),
      exchanges: this.localization.localize('profile.about.exchanges', 'ecommerce'),
      terms: this.localization.localize('profile.about.terms', 'ecommerce'),
      privacy: this.localization.localize('profile.about.privacy', 'ecommerce'),
      spanish: this.localization.localize('profile.login.spanish', 'ecommerce'),
      english: this.localization.localize('profile.login.english', 'ecommerce'),
    };
  }

  filterByCountryModal() {
    this.dialog.showWithData({
      component: ModalCountryComponent,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium'],
      componentProps: {
        title: this.localization.localize('basket.shippingOptions.labelCountry', 'ecommerce'),
        showCode: false,
        countryId: this.country.id,
        countryCode: this.country.code,
        tax: false,
      },
    }).then((response: any) => {
      if (response.data.result !== 'cancel') {
        this.country = response.data.result;
      }
    });
  }

  close() {
    this.dialog.dismiss('cancel');
  }

  goToRoute(route: string) {
    this.dialog.dismiss();
    setTimeout(() => {
      this.navigation.forwardNoAnimation(route);
    }, 100);

  }

  modalLogin() {
    this.dialog.showWithData<"confirm" | undefined>({
      component: LoginTabletComponent,
      backdropDismiss: false,
      leaveAnimation: this._animationModalService.closeDesktopModal,
      cssClass: ['modal-custom', 'modal-custom--in-center-medium']
    });
  }
  goToBook() {
    if (!this.userIsAuthenticated) {
      this.modalLogin()
    } else {
      this.dialog.dismiss();
      setTimeout(() => {
        this.navigation.forwardNoAnimation('/app/ecommerce/profile/book-of-claims')
      })
    }
  }

  async getStateLoged(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.authTokenService.isAuthenticated()
        .subscribe((isAuthenticated) => {
          this.userIsAuthenticated = isAuthenticated;

          resolve(isAuthenticated);
        }, (error) => {
          // Manejo de errores si es necesario
          reject(error);
        });
    });
  }
}
