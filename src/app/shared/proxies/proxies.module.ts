import { ModuleWithProviders, NgModule } from '@angular/core';
import { CoreModule } from '@geor360/core';
import { BasketServiceProxy } from './basket/basket.proxie.service';
import { ProductServiceProxy } from './home/product.proxie';
import { AccountServiceProxy } from './profile/account.proxie';
import { AddressServiceProxy } from './profile/address.proxie';
import { AuthServiceProxy } from './profile/auth.proxie';
import { BillingServiceProxy } from './profile/billing.proxie';
import { CardServiceProxy } from './profile/card.proxie';
import { FavoriteServiceProxy } from './profile/favorites.proxie';
import { GoogleServiceProxy } from './profile/google.proxies';
import { ProfileServiceProxy } from './profile/profile.proxies';
import { SessionServiceProxy } from './profile/session.proxie';
import { EstablismentServiceProxy } from './public/establisment.proxie';
import { PaymentMethodServiceProxy } from './public/payment-method.proxie';
import { PublicServiceProxy } from './public/public.proxie';
import { ShippingServiceProxy } from './public/shipping.proxie';
import { ChatConfigurationServiceProxy } from './store/chat-configuration.proxie';
import { OrderServiceProxy } from './profile/order.proxie';
import { InboxStoreServiceProxy } from './inbox/store.proxy';
import { InboxChatServiceProxy } from './inbox/chat.proxy';
import { InboxMultimediaServiceProxy } from './inbox/multimedia.proxy';
import { InboxChannelServiceProxy } from './inbox/channel.proxy';



































@NgModule({
  imports: [
    CoreModule
  ]
})
export class ProxiesModule {

  static forRoot(): ModuleWithProviders<ProxiesModule> {
    return {
      ngModule: ProxiesModule,
      providers: [
        AccountServiceProxy,
        AddressServiceProxy,
        AuthServiceProxy,
        BasketServiceProxy,
        BillingServiceProxy,
        CardServiceProxy,
        EstablismentServiceProxy,
        FavoriteServiceProxy,
        GoogleServiceProxy,
        ProductServiceProxy,
        ProfileServiceProxy,
        PublicServiceProxy,
        SessionServiceProxy,
        ShippingServiceProxy,
        PaymentMethodServiceProxy,
        EstablismentServiceProxy,
        CardServiceProxy,
        FavoriteServiceProxy,
        ChatConfigurationServiceProxy,
        OrderServiceProxy,
        InboxStoreServiceProxy,
        InboxChatServiceProxy,
        InboxMultimediaServiceProxy,
        InboxChannelServiceProxy
      ]
    };
  }
}