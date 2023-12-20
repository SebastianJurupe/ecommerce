import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { DeleteInvoiceComponent } from './delete-invoice/mobile/delete-invoice.component';
import { DeleteAddressComponent } from './delete-address/delete-address.component';
import { IonicModule } from '@ionic/angular';
import { CameraGalleryComponent } from './camera-gallery/camera-gallery.component';
import { EmailCodeComponent } from './email-code/email-code.component';
import { LogoutComponent } from './logout/mobile/logout.component';
import { PhoneCodeComponent } from './phone-code/phone-code.component';
import { CountryLanguageComponent } from './country-language/country-language.component';
import { DeleteOrderComponent } from './delete-order/delete-order.component';
import { DeleteCardComponent } from './delete-card/mobile/delete-card.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { MoveToBasketComponent } from './move-to-basket/move-to-basket.component';
import { FormsModule } from '@angular/forms';
import { CodeConfirmationComponent } from './code-confirmation/code-confirmation.component';
import { ConfirmationEmailComponent } from './confirmation-email/confirmation-email.component';
import { NameBaseComponent, NameDesktopComponent, NameMobileComponent, NameTabletComponent } from './name';
import { PhoneBaseComponent, PhoneDesktopComponent, PhoneMobileComponent, PhoneTabletComponent } from './phone';
import { PasswordBaseComponent, PasswordDesktopComponent, PasswordMobileComponent, PasswordTabletComponent } from './password';
import { EmailBaseComponent, EmailDesktopComponent, EmailMobileComponent, EmailTabletComponent } from './email';
import { ProfileComponent } from './profile/profile.component';
import { LogoutDesktopComponent } from './logout/desktop/logout-desktop.component';
import { DeleteInvoiceDesktopComponent } from './delete-invoice/desktop/delete-invoice-desktop.component';
import { DeleteCardDesktopComponent } from './delete-card/desktop/delete-card.component-desktop';
import { UnverifiedAccountComponent } from './unverified-account/unverified-account.component';
import { VerifyEmailPhoneComponent } from './verify-email-phone/verify-email-phone.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ComponentsModule,
    IonicModule,
    FormsModule
  ],
  declarations: [
    DeleteInvoiceDesktopComponent,
    DeleteInvoiceComponent,
    DeleteAddressComponent,
    CameraGalleryComponent,
    EmailCodeComponent,
    LogoutComponent,
    LogoutDesktopComponent,
    CodeConfirmationComponent,
    PhoneCodeComponent,
    CountryLanguageComponent,
    DeleteOrderComponent,
    DeleteCardComponent,
    DeleteCardDesktopComponent,
    ConfirmationEmailComponent,
    AddAddressComponent,
    MoveToBasketComponent,

    NameBaseComponent,
    NameMobileComponent,
    NameTabletComponent,
    NameDesktopComponent,

    PhoneMobileComponent,
    PhoneTabletComponent,
    PhoneDesktopComponent,
    PhoneBaseComponent,

    PasswordMobileComponent,
    PasswordTabletComponent,
    PasswordDesktopComponent,
    PasswordBaseComponent,

    EmailBaseComponent,
    EmailMobileComponent,
    EmailTabletComponent,
    EmailDesktopComponent,

    ProfileComponent,
    UnverifiedAccountComponent,
    VerifyEmailPhoneComponent
  ],
})
export class ModalsModule { }
