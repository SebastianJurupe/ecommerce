import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewComponent, isNullEmptyOrWhiteSpace } from '@geor360/core';
import { InboxChannelServiceProxy } from '@shared/proxies/inbox/channel.proxy';
import { InboxService } from '../../services/inbox.service';

@Component({
    selector: 'app-chat',
    templateUrl: 'chat-base.component.html',
    styleUrls: [
        'chat-base.component.scss'
    ]
})
export class InboxChatBaseComponent extends ViewComponent implements OnInit {

    private inboxChannelServiceProxy: InboxChannelServiceProxy;
    private activatedRoute: ActivatedRoute;

    service: InboxService;

    constructor(injector: Injector) {
        super(injector);

        this.inboxChannelServiceProxy = injector.get(InboxChannelServiceProxy);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.service = injector.get(InboxService);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe({
            next: (params) => {
                const channelId: string = params['channelId'];

                if (!isNullEmptyOrWhiteSpace(channelId)) {
                    this.service.channelId = channelId;

                    this.inboxChannelServiceProxy
                        .getChatByIdClient(this.service.channelId)
                        .subscribe({
                            next: (response) => {
                                this.service.channel = response;
                            },
                            error: () => this.navigation.back('/app/ecommerce/inbox/chat')
                        });
                }
            }
        });
    }

    onBackButtonPressed(): void {
        this.service.channel = undefined;
        this.service.channelId = undefined;

        this.navigation.back('/app/ecommerce/inbox/chat');
    }
}