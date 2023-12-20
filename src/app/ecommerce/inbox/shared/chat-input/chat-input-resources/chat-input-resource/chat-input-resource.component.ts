import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatResourceDto } from '@shared/proxies/inbox/chat.proxy';

@Component({
    selector: 'inbox-chat-input-resource',
    templateUrl: 'chat-input-resource.component.html',
    styleUrls: [
        'chat-input-resource.component.scss'
    ]
})
export class InboxChatInputResourcesComponent {

    @Input() resource!: ChatResourceDto;
    @Output() onRemove: EventEmitter<void> = new EventEmitter<void>();
}