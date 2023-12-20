import { Component, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { ChannelDto, ChannelMessageDto, InboxChannelServiceProxy } from '@shared/proxies/inbox/channel.proxy';
import { Subscription, finalize } from 'rxjs';
import { InboxService } from '../../services/inbox.service';

interface IPaginator<T> {
    maxResultCount: number;
    skipCount: () => number;
    totalRecordsCount: number;
    records: T[];
}

@Component({
    selector: 'inbox-chat-history',
    templateUrl: 'chat-history.component.html',
    styleUrls: [
        'chat-history.component.scss'
    ]
})
export class InboxChatHistoryComponent implements OnInit, OnDestroy {

    private inboxChannelServiceProxy: InboxChannelServiceProxy;
    private service: InboxService;

    @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

    @Input() channel!: ChannelDto;

    busy: boolean = false;
    pagination: IPaginator<ChannelMessageDto> = {
        totalRecordsCount: 0,
        records: [],
        maxResultCount: 50,
        skipCount: () => {
            return this.pagination.records.length;
        }
    };

    private messageSubscription!: Subscription;
    private requestSubscription!: Subscription;

    constructor(injector: Injector) {
        this.inboxChannelServiceProxy = injector.get(InboxChannelServiceProxy);
        this.service = injector.get(InboxService);
    }

    ngOnInit(): void {
        this.getData();

        this.messageSubscription = this.service.onMessage.subscribe({
            next: (newMessage) => {

                if (this.service.channels !== undefined && this.service.channels !== null) {

                    const index: number = this.service
                        .channels
                        .findIndex(p => p.channelId == newMessage.channelId);

                    if (index != -1) {
                        this.service.channels[index].lastMessage = newMessage;
                    }
                }

                this.pagination.records.push(newMessage);
                this.scroll();
            }
        });
    }

    ngOnDestroy(): void {
        this.messageSubscription?.unsubscribe();
        this.requestSubscription?.unsubscribe();
    }

    async getData(event?: any): Promise<void> {
        this.busy = true;

        if (!event)
            this.pagination.records = [];

        this.requestSubscription?.unsubscribe();
        this.requestSubscription = this.inboxChannelServiceProxy
            .getChatCrm(
                this.channel.channelId,
                this.pagination.maxResultCount,
                this.pagination.skipCount()
            ).pipe(finalize(async () => this.busy = false)).subscribe({
                next: (result) => {

                    if (event) {
                        if (!this.pagination.records)
                            this.pagination.records = [];

                        for (let item of result.items!) {
                            item.format();
                            this.pagination.records.push(item);
                        }

                        this.pagination.totalRecordsCount = result.totalCount;

                        this.infiniteScroll.complete();

                        if (result.totalCount == this.pagination.records.length)
                            this.infiniteScroll.disabled = true;

                    } else {
                        for (let item of result.items!)
                            item.format();

                        this.pagination.records = result.items!;
                        this.pagination.totalRecordsCount = result.totalCount;

                        this.infiniteScroll.complete();
                        this.infiniteScroll.disabled = false;

                        if (result.totalCount == 0 || result.totalCount == this.pagination.records.length)
                            this.infiniteScroll.disabled = true;

                        this.render();
                    }
                }
            });
    }

    private scroll(): void {
        setTimeout(() => {
            const element: HTMLElement = document.getElementById('chat-content')!;
            element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
        }, 150);
    }

    private render(): void {
        setTimeout(() => {
            const element: HTMLElement = document.getElementById('chat-content')!;
            element.scrollTo({ top: element.scrollHeight, behavior: <any>'instant' });

            setTimeout(() => {
                element.style.visibility = 'inherit';
            }, 250);

        }, 150);
    }
}