import { Component, Input, OnInit } from '@angular/core';
import { ChannelDto, ChannelMessageDto } from '@shared/proxies/inbox/channel.proxy';

@Component({
    selector: 'inbox-chat-history-item',
    templateUrl: 'chat-history-item.component.html',
    styleUrls: [
        'chat-history-item.component.scss'
    ]
})
export class InboxChatHistoryItemComponent implements OnInit {

    @Input() channel!: ChannelDto;
    @Input() message!: ChannelMessageDto;

    ngOnInit() {
        //console.log(this.message);
        this.message.isCurrentUserMessage = true;
    }
}