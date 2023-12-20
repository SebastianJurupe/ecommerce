import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { AddressModule } from './address/address.module';
import { ModalsModule } from './modals/modals.module';

import { AngularCropperjsModule } from 'angular-cropperjs';
import { AboutBaseComponent, AboutDesktopComponent, AboutMobileComponent, AboutTabletComponent } from './about';
import { AboutUsBaseComponent, AboutUsDesktopComponent, AboutUsMobileComponent, AboutUsTabletComponent } from './about-us';
import { BookOfClaimsBaseComponent, BookOfClaimsDesktopComponent, BookOfClaimsMobileComponent, BookOfClaimsTabletComponent } from './book-of-claims';
import { RegisteredClaimBaseComponent, RegisteredClaimDesktopComponent, RegisteredClaimMobileComponent, RegisteredClaimTabletComponent } from './book-of-claims/registered-claim';
import { CardsBaseComponent, CardsDesktopComponent, CardsMobileComponent, CardsTabletComponent } from './cards';
import { AddCardBaseComponent, AddCardDesktopComponent, AddCardMobileComponent, AddCardTabletComponent } from './cards/add-card';
import { CardItemBaseComponent, CardItemDesktopComponent, CardItemMobileComponent, CardItemTabletComponent } from './cards/card-item';
import { ChangeModeBaseComponent, ChangeModeDesktopComponent, ChangeModeMobileComponent, ChangeModeTabletComponent } from './change-mode';
import { CodeConfirmationEmailBaseComponent, CodeConfirmationEmailDesktopComponent, CodeConfirmationEmailMobileComponent, CodeConfirmationEmailTabletComponent } from './code-confirmation-email';
import { CodeConfirmationPhoneBaseComponent, CodeConfirmationPhoneDesktopComponent, CodeConfirmationPhoneMobileComponent, CodeConfirmationPhoneTabletComponent } from './code-confirmation-phone';
import { CodeConfirmationResetBaseComponent, CodeConfirmationResetDesktopComponent, CodeConfirmationResetMobileComponent, CodeConfirmationResetTabletComponent } from './code-confirmation-reset';
import { ConfirmEmailBaseComponent, ConfirmEmailDesktopComponent, ConfirmEmailMobileComponent, ConfirmEmailTabletComponent } from './confirm-email';
import { CouponsBaseComponent, CouponsDesktopComponent, CouponsMobileComponent, CouponsTabletComponent } from './coupons';
import { ConditionsBaseComponent, ConditionsDesktopComponent, ConditionsMobileComponent, ConditionsTabletComponent } from './coupons/conditions';
import { ExchangesReturnsBaseComponent, ExchangesReturnsDesktopComponent, ExchangesReturnsMobileComponent, ExchangesReturnsTabletComponent } from './exchanges-returns/indez';
import { FavoritesBaseComponent, FavoritesDesktopComponent, FavoritesMobileComponent, FavoritesTabletComponent, } from './favorites';
import { FavoriteItemBaseComponent, FavoriteItemDesktopComponent, FavoriteItemMobileComponent, FavoriteItemTabletComponent } from './favorites/favorite-item';
import { HelpBaseComponent, HelpDesktopComponent, HelpMobileComponent, HelpTabletComponent } from './help';
import { HomeBaseComponent, HomeDesktopComponent, HomeMobileComponent, HomeTabletComponent } from './home';
import { InvoicingModule } from './invoicing/invoicing.module';
import { LanguageBaseComponent, LanguageDesktopComponent, LanguageMobileComponent, LanguageTabletComponent } from './language';
import { LoginBaseComponent, LoginDesktopComponent, LoginMobileComponent, LoginTabletComponent } from './login';
import { LoginGuard } from './login.guard';
import { OrderDetailBaseComponent, OrderDetailDesktopComponent, OrderDetailMobileComponent, OrderDetailTabletComponent } from './order-detail';
import { FormatDateRangePipe } from './order-detail/base/formatDateRange.pipe';
import { ProductVariantSrcPipe } from './order-detail/base/productVariantSrc.pipe';
import { ProductVariantsDetailPipe } from './order-detail/base/productVariantsDetail.pipe';
import { BillingInfoPopoverComponent } from './order-detail/billing-info-popover/billing-info-popover.component';
import { OptionsOrderPopoverComponent } from './order-detail/options-order-popover/options-order-popover.component';
import { OrdersBaseComponent, OrdersDesktopComponent, OrdersMobileComponent, OrdersTabletComponent } from './orders';
import { OrderItemBaseComponent, OrderItemDesktopComponent, OrderItemMobileComponent, OrderItemTabletComponent } from './orders/order-item';
import { OrderStatusPopoverComponent } from './orders/order-status-popover/order-status-popover.component';
import { PersonalInformationBaseComponent, PersonalInformationDesktopComponent, PersonalInformationMobileComponent, PersonalInformationTabletComponent } from './personal-information';
import { PrivacyPoliciesBaseComponent, PrivacyPoliciesDesktopComponent, PrivacyPoliciesMobileComponent, PrivacyPoliciesTabletComponent } from './privacy-policies';
import { ProfileRoutingModule } from './profile-routing.module';
import { RegisterBaseComponent, RegisterDesktopComponent, RegisterMobileComponent, RegisterTabletComponent } from './register';
import { ResetPasswordBaseComponent, ResetPasswordDesktopComponent, ResetPasswordMobileComponent, ResetPasswordTabletComponent } from './reset-password';
import { SettingsBaseComponent, SettingsDesktopComponent, SettingsMobileComponent, SettingsTabletComponent } from './settings';
import { ModalCropperComponent } from './settings/modal-cropper/modal-cropper.component';
import { TermsConditionsBaseComponent, TermsConditionsDesktopComponent, TermsConditionsMobileComponent, TermsConditionsTabletComponent } from './terms-conditions';


@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    InvoicingModule,
    AddressModule,
    IonicModule,
    PipesModule,
    ProfileRoutingModule,
    SharedModule,
    ModalsModule,
    AngularCropperjsModule,
  ],
  declarations: [
    HomeBaseComponent,
    HomeMobileComponent,
    HomeTabletComponent,
    HomeDesktopComponent,

    AboutBaseComponent,
    AboutMobileComponent,
    AboutTabletComponent,
    AboutDesktopComponent,

    ChangeModeBaseComponent,
    ChangeModeMobileComponent,
    ChangeModeTabletComponent,
    ChangeModeDesktopComponent,

    FavoritesBaseComponent,
    FavoritesMobileComponent,
    FavoritesTabletComponent,
    FavoritesDesktopComponent,

    PersonalInformationBaseComponent,
    PersonalInformationMobileComponent,
    PersonalInformationTabletComponent,
    PersonalInformationDesktopComponent,

    LanguageBaseComponent,
    LanguageMobileComponent,
    LanguageTabletComponent,
    LanguageDesktopComponent,

    LoginBaseComponent,
    LoginMobileComponent,
    LoginTabletComponent,
    LoginDesktopComponent,

    RegisterBaseComponent,
    RegisterMobileComponent,
    RegisterTabletComponent,
    RegisterDesktopComponent,

    ConfirmEmailBaseComponent,
    ConfirmEmailMobileComponent,
    ConfirmEmailTabletComponent,
    ConfirmEmailDesktopComponent,

    ResetPasswordBaseComponent,
    ResetPasswordMobileComponent,
    ResetPasswordTabletComponent,
    ResetPasswordDesktopComponent,

    SettingsBaseComponent,
    SettingsMobileComponent,
    SettingsTabletComponent,
    SettingsDesktopComponent,
    ModalCropperComponent,

    BookOfClaimsBaseComponent,
    BookOfClaimsMobileComponent,
    BookOfClaimsTabletComponent,
    BookOfClaimsDesktopComponent,

    RegisteredClaimBaseComponent,
    RegisteredClaimMobileComponent,
    RegisteredClaimTabletComponent,
    RegisteredClaimDesktopComponent,

    OrdersBaseComponent,
    OrdersMobileComponent,
    OrdersTabletComponent,
    OrdersDesktopComponent,

    OrderStatusPopoverComponent,
    OptionsOrderPopoverComponent,
    // DeleteOrderComponent,
    CouponsBaseComponent,
    CouponsMobileComponent,
    CouponsTabletComponent,
    CouponsDesktopComponent,

    ConditionsBaseComponent,
    ConditionsMobileComponent,
    ConditionsTabletComponent,
    ConditionsDesktopComponent,

    ExchangesReturnsBaseComponent,
    ExchangesReturnsMobileComponent,
    ExchangesReturnsTabletComponent,
    ExchangesReturnsDesktopComponent,

    AboutUsBaseComponent,
    AboutUsMobileComponent,
    AboutUsTabletComponent,
    AboutUsDesktopComponent,

    PrivacyPoliciesBaseComponent,
    PrivacyPoliciesMobileComponent,
    PrivacyPoliciesTabletComponent,
    PrivacyPoliciesDesktopComponent,

    TermsConditionsBaseComponent,
    TermsConditionsMobileComponent,
    TermsConditionsTabletComponent,
    TermsConditionsDesktopComponent,

    FavoriteItemBaseComponent,
    FavoriteItemMobileComponent,
    FavoriteItemTabletComponent,
    FavoriteItemDesktopComponent,

    OrderItemBaseComponent,
    OrderItemMobileComponent,
    OrderItemTabletComponent,
    OrderItemDesktopComponent,

    // CountryLanguageComponent,

    OrderDetailBaseComponent,
    OrderDetailMobileComponent,
    OrderDetailTabletComponent,
    OrderDetailDesktopComponent,

    BillingInfoPopoverComponent,

    AddCardBaseComponent,
    AddCardMobileComponent,
    AddCardTabletComponent,
    AddCardDesktopComponent,

    CardsBaseComponent,
    CardsMobileComponent,
    CardsTabletComponent,
    CardsDesktopComponent,

    CardItemBaseComponent,
    CardItemMobileComponent,
    CardItemTabletComponent,
    CardItemDesktopComponent,

    HelpBaseComponent,
    HelpMobileComponent,
    HelpTabletComponent,
    HelpDesktopComponent,

    CodeConfirmationPhoneMobileComponent,
    CodeConfirmationPhoneTabletComponent,
    CodeConfirmationPhoneDesktopComponent,
    CodeConfirmationPhoneBaseComponent,

    CodeConfirmationEmailMobileComponent,
    CodeConfirmationEmailTabletComponent,
    CodeConfirmationEmailDesktopComponent,
    CodeConfirmationEmailBaseComponent,

    CodeConfirmationResetMobileComponent,
    CodeConfirmationResetTabletComponent,
    CodeConfirmationResetDesktopComponent,
    CodeConfirmationResetBaseComponent,

    ProductVariantsDetailPipe,
    ProductVariantSrcPipe,
    FormatDateRangePipe
  ],
  exports: [
    ExchangesReturnsTabletComponent,
  ],
  providers: [
    LoginGuard,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProfileModule { }

