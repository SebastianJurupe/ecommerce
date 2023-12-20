import { Component, Input } from '@angular/core';
import { ChannelMultimediaDto, MediaType } from '@shared/proxies/inbox/channel.proxy';
import { bytesToSize } from '@shared/proxies/inbox/chat.proxy';
import { DateTime } from 'luxon';

@Component({
    selector: 'inbox-chat-history-resource',
    templateUrl: 'chat-history-resource.component.html',
    styleUrls: [
        'chat-history-resource.component.scss'
    ]
})
export class InboxChatHistoryResourceComponent {

    @Input() resource!: ChannelMultimediaDto;
    @Input() createdDate!: DateTime;
    @Input() hasUniqueResource: boolean = true;
    @Input() mediaType!: MediaType;

    get size(): string {
        return `${bytesToSize(+this.resource.size)}`;
    }

    get fileIcon() {
        switch (this.resource.formatedMymeType) {
            case 'pdf': return 'icon icon--file-pdf icon--delete';
            case 'doc': return 'icon icon--file-doc';
            case 'docx': return 'icon icon--file-doc';
            case 'xlsx': return 'icon icon--file-calc';
            case 'xsl': return 'icon icon--file-calc';
            case 'csv': return 'icon icon--file-calc';
            default: return 'icon--file-general';
        }
    }

    onAction(): void {
        if (this.mediaType === MediaType.Image || this.mediaType === MediaType.Audio) return;
        window.open(this.resource.url, '_blank');
    }
}