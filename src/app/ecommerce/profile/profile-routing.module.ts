import { NgModule } from '@angular/core';
import { ROUTES, RouterModule, Routes } from '@angular/router';
import { AppConfigurationService } from '@geor360/core';
import { AuthDesktopGuard } from '@shared/guards/auth-desktop.guard';
import { AboutMobileComponent } from './about';
import { AboutUsDesktopComponent, AboutUsMobileComponent } from './about-us';
import { FormAddressMobileComponent } from './address/form-address';
import { ListAddressDesktopComponent, ListAddressMobileComponent } from './address/list-address';
import { MapMobileComponent } from './address/map';
import { BookOfClaimsDesktopComponent, BookOfClaimsMobileComponent } from './book-of-claims';
import { CardsDesktopComponent, CardsMobileComponent } from './cards';
import { AddCardDesktopComponent, AddCardMobileComponent } from './cards/add-card';
import { ChangeModeMobileComponent } from './change-mode';
import { CodeConfirmationEmailDesktopComponent, CodeConfirmationEmailMobileComponent } from './code-confirmation-email';
import { CodeConfirmationPhoneMobileComponent } from './code-confirmation-phone';
import { CodeConfirmationResetMobileComponent } from './code-confirmation-reset';
import { ConfirmEmailDesktopComponent, ConfirmEmailMobileComponent } from './confirm-email';
import { CouponsDesktopComponent, CouponsMobileComponent } from './coupons';
import { ConditionsDesktopComponent, ConditionsMobileComponent } from './coupons/conditions';
import { ExchangesReturnsDesktopComponent, ExchangesReturnsMobileComponent } from './exchanges-returns/indez';
import { FavoritesDesktopComponent, FavoritesMobileComponent } from './favorites';
import { HelpDesktopComponent, HelpMobileComponent } from './help';
import { HomeMobileComponent } from './home';
import { FormMobileComponent } from './invoicing/form';
import { ListDesktopComponent, ListMobileComponent } from './invoicing/list';
import { LanguageMobileComponent } from './language';
import { LoginMobileComponent } from './login';
import { LoginGuard } from './login.guard';
import { OrderDetailDesktopComponent, OrderDetailMobileComponent } from './order-detail';
import { OrdersDesktopComponent, OrdersMobileComponent } from './orders';
import { PersonalInformationMobileComponent } from './personal-information';
import { PrivacyPoliciesDesktopComponent, PrivacyPoliciesMobileComponent } from './privacy-policies';
import { RegisterMobileComponent } from './register';
import { ResetPasswordDesktopComponent, ResetPasswordMobileComponent } from './reset-password';
import { SettingsDesktopComponent, SettingsMobileComponent } from './settings';
import { TermsConditionsDesktopComponent, TermsConditionsMobileComponent } from './terms-conditions';

const mobileRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeMobileComponent, canActivate: [LoginGuard] },
      { path: 'about', component: AboutMobileComponent },
      { path: 'add-card', component: AddCardMobileComponent },
      { path: 'book-of-claims', component: BookOfClaimsMobileComponent },
      { path: 'cards', component: CardsMobileComponent },
      { path: 'change-mode', component: ChangeModeMobileComponent },
      { path: 'code-confirmation-phone/:phone/:email', component: CodeConfirmationPhoneMobileComponent },
      { path: 'code-confirmation-email/:email', component: CodeConfirmationEmailMobileComponent },
      { path: 'code-confirmation-reset/:email', component: CodeConfirmationResetMobileComponent },
      { path: 'order-detail/:code', component: OrderDetailMobileComponent },
      { path: 'confirm-email', component: ConfirmEmailMobileComponent },
      { path: 'coupon-conditions', component: ConditionsMobileComponent },
      { path: 'coupons', component: CouponsMobileComponent },
      { path: 'exchanges-returns', component: ExchangesReturnsMobileComponent },
      { path: 'favorites', component: FavoritesMobileComponent },
      { path: 'about-us', component: AboutUsMobileComponent },
      { path: 'help', component: HelpMobileComponent },
      { path: 'personal-information', component: PersonalInformationMobileComponent },
      { path: 'invoicing-form', component: FormMobileComponent },
      { path: 'address-form', component: FormAddressMobileComponent },
      { path: 'invoicing-list', component: ListMobileComponent },
      { path: 'address-list', component: ListAddressMobileComponent },
      { path: 'language', component: LanguageMobileComponent },
      { path: 'login', component: LoginMobileComponent },
      { path: 'orders', component: OrdersMobileComponent },
      { path: 'privacy-policies', component: PrivacyPoliciesMobileComponent },
      { path: 'register', component: RegisterMobileComponent },
      { path: 'reset-password/:email/:code', component: ResetPasswordMobileComponent },
      { path: 'setting', component: SettingsMobileComponent },
      { path: 'terms-conditions', component: TermsConditionsMobileComponent },
      { path: 'map', component: MapMobileComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]
  }

];

// const tabletRoutes: Routes = [
//   {
//     path: '',
//     children: [
//       { path: 'home', component: HomeTabletComponent },
//       { path: 'about', component: AboutTabletComponent },
//       { path: 'add-card', component: AddCardTabletComponent },
//       { path: 'book-of-claims', component: BookOfClaimsTabletComponent },
//       { path: 'cards', component: CardsTabletComponent },
//       { path: 'change-mode', component: ChangeModeTabletComponent },
//       { path: 'code-confirmation/:type', component: CodeConfirmationEmailTabletComponent },
//       { path: 'order-detail/:code', component: OrderDetailTabletComponent },
//       { path: 'confirm-email', component: ConfirmEmailTabletComponent },
//       { path: 'coupon-conditions', component: ConditionsTabletComponent },
//       { path: 'coupons', component: CouponsTabletComponent },
//       { path: 'exchanges-returns', component: ExchangesReturnsTabletComponent },
//       { path: 'favorites', component: FavoritesTabletComponent },
//       { path: 'about-us', component: AboutUsTabletComponent },
//       { path: 'help', component: HelpTabletComponent },
//       { path: 'personal-information', component: PersonalInformationTabletComponent },
//       { path: 'invoicing-form', component: FormTabletComponent },
//       { path: 'address-form', component: FormAddressTabletComponent },
//       { path: 'invoicing-list', component: ListTabletComponent },
//       { path: 'address-list', component: ListAddressTabletComponent },
//       { path: 'language', component: LanguageTabletComponent },
//       { path: 'login', component: LoginTabletComponent },
//       { path: 'orders', component: OrdersTabletComponent },
//       { path: 'privacy-policies', component: PrivacyPoliciesTabletComponent },
//       { path: 'register', component: RegisterTabletComponent },
//       { path: 'reset-password/:email/:code', component: ResetPasswordTabletComponent },
//       { path: 'setting', component: SettingsTabletComponent },
//       { path: 'terms-conditions', component: TermsConditionsTabletComponent },
//       { path: 'map', component: MapTabletComponent },
//       { path: '', redirectTo: 'login', pathMatch: 'full' },
//       { path: '**', redirectTo: 'home', pathMatch: 'full' },
//     ]
//   }

// ];
const desktopRoutes: Routes = [
  {
    path: '',
    children: [
      // { path: 'home', component: HomeDesktopComponent },
      // { path: 'about', component: AboutDesktopComponent },
      { path: 'add-card', component: AddCardDesktopComponent },
      { path: 'book-of-claims', component: BookOfClaimsDesktopComponent },
      { path: 'cards', component: CardsDesktopComponent, canActivate: [AuthDesktopGuard] },
      // { path: 'change-mode', component: ChangeModeDesktopComponent },
      { path: 'code-confirmation/:type', component: CodeConfirmationEmailDesktopComponent },
      { path: 'order-detail/:code', component: OrderDetailDesktopComponent, canActivate: [AuthDesktopGuard] },
      { path: 'confirm-email', component: ConfirmEmailDesktopComponent },
      { path: 'coupon-conditions', component: ConditionsDesktopComponent },
      { path: 'coupons', component: CouponsDesktopComponent, canActivate: [AuthDesktopGuard] },
      { path: 'exchanges-returns', component: ExchangesReturnsDesktopComponent },
      { path: 'favorites', component: FavoritesDesktopComponent, canActivate: [AuthDesktopGuard] },
      { path: 'about-us', component: AboutUsDesktopComponent },
      { path: 'help', component: HelpDesktopComponent, canActivate: [AuthDesktopGuard] },
      // { path: 'personal-information', component: PersonalInformationDesktopComponent },
      // { path: 'invoicing-form', component: FormDesktopComponent },
      // { path: 'address-form', component: FormAddressDesktopComponent },
      { path: 'invoicing-list', component: ListDesktopComponent, canActivate: [AuthDesktopGuard] },
      { path: 'address-list', component: ListAddressDesktopComponent, canActivate: [AuthDesktopGuard] },
      // { path: 'language', component: LanguageDesktopComponent },
      // { path: 'login', component: LoginDesktopComponent },
      { path: 'orders', component: OrdersDesktopComponent, canActivate: [AuthDesktopGuard] },
      { path: 'privacy-policies', component: PrivacyPoliciesDesktopComponent },
      // { path: 'register', component: RegisterDesktopComponent },
      { path: 'reset-password/:email/:code', component: ResetPasswordDesktopComponent },
      { path: 'setting', component: SettingsDesktopComponent, canActivate: [AuthDesktopGuard] },
      { path: 'terms-conditions', component: TermsConditionsDesktopComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: (configuration: AppConfigurationService) => {

        let deviceRoutes: Routes = [];
        const screen = configuration.screen();

        if (screen == 'mobile') {
          deviceRoutes = mobileRoutes;
        }
        else if (screen == 'tablet') {
          deviceRoutes = desktopRoutes;
        } else {
          deviceRoutes = desktopRoutes;
        }
        return [
          ...deviceRoutes
        ];
      },
      deps: [AppConfigurationService],
      multi: true
    }
  ]
})
export class ProfileRoutingModule { }



