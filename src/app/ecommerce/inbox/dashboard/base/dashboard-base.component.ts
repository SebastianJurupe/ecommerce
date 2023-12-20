import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { InboxStoreServiceProxy } from '@shared/proxies/inbox/store.proxy';
import { ChatConfigurationServiceProxy } from '@shared/proxies/store/chat-configuration.proxie';
import { ChannelDto, InboxChannelServiceProxy } from '@shared/proxies/inbox/channel.proxy';
import { InboxService } from '../../services/inbox.service';

@Component({
  template: ''
})
export class InboxDashboardBaseComponent extends ViewComponent implements OnInit {

  private inboxStoreServiceProxy: InboxStoreServiceProxy;
  private inboxChannelServiceProxy: InboxChannelServiceProxy;
  private chatConfigurationServiceProxy: ChatConfigurationServiceProxy;

  service: InboxService;

  get screen(): string {
    return this.configuration.screen();
  }

  constructor(_injector: Injector) {
    super(_injector);

    this.inboxStoreServiceProxy = _injector.get(InboxStoreServiceProxy);
    this.inboxChannelServiceProxy = _injector.get(InboxChannelServiceProxy);
    this.chatConfigurationServiceProxy = _injector.get(ChatConfigurationServiceProxy);
    this.service = _injector.get(InboxService);
  }

  ngOnInit(): void {
    if (this.session.user) {
      this.load();
    }
  }

  openChannel(channel: ChannelDto) {
    this.navigation.forward('/app/ecommerce/inbox/chat/' + encodeURI(channel.channelId));
  }

  async load(): Promise<void> {

    this.chatConfigurationServiceProxy
      .isEnabled()
      .subscribe({
        next: (response) => {
          this.service.status.enabled = response.isEnabled;

          if (this.service.status.enabled) {

            this.inboxStoreServiceProxy
              .verifyToken(response.configuration.accessToken)
              .subscribe({
                next: () => {

                  this.inboxChannelServiceProxy.getAllChatByClient(10, 0).subscribe({
                    next: (channels) => {
                      this.service.status.loaded = true;
                      this.service.channels = channels.items!;
                    }
                  });
                },
                error: () => this.navigation.forward('/app/ecommerce/inbox/disabled')
              });

          } else {
            this.navigation.forward('/app/ecommerce/inbox/disabled');
          }
        },
        error: async () => {
          this.service.status.exception = true;
        }
      });
  }
}