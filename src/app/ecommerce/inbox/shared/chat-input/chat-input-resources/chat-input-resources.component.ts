import { Component, Input } from '@angular/core';
import { ChatResourceDto } from '@shared/proxies/inbox/chat.proxy';

@Component({
    selector: 'inbox-chat-input-resources',
    templateUrl: 'chat-input-resources.component.html',
    styleUrls: [
        'chat-input-resources.component.scss'
    ]
})
export class InboxChatInputResourceComponent {
    @Input() resources!: ChatResourceDto[];

    onRemove(index: number): void {
        this.resources.splice(index, 1);
    }
}