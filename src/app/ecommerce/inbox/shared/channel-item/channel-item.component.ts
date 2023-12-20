import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { ChannelDto } from '@shared/proxies/inbox/channel.proxy';
import { InboxService } from '../../services/inbox.service';

@Component({
    selector: 'inbox-channel-item',
    templateUrl: 'channel-item.component.html',
    styleUrls: [
        'channel-item.component.scss'
    ]
})
export class InboxChannelItemComponent {

    @Input() channel!: ChannelDto;
    @Input() index!: number;

    @Output() onAction: EventEmitter<void> = new EventEmitter<void>();

    service: InboxService;

    constructor(injector: Injector) {
        this.service = injector.get(InboxService);
    }
}