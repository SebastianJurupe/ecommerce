import { Injectable } from "@angular/core";
import { ChannelDto, ChannelMessageDto } from "@shared/proxies/inbox/channel.proxy";
import { Subject } from "rxjs";

interface IChatStatus {
    loaded: boolean;
    enabled: boolean;
    exception: boolean;
}

@Injectable()
export class InboxService {

    status: IChatStatus = {
        enabled: false,
        exception: false,
        loaded: false
    }

    channels!: ChannelDto[];

    channelId!: string | undefined;
    channel!: ChannelDto | undefined;

    onMessage: Subject<ChannelMessageDto> = new Subject<ChannelMessageDto>();
}