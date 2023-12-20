import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IJsonConvertable, PagedResultDto, isNullEmptyOrWhiteSpace } from "@geor360/core";
import { DateTime } from "luxon";
import { Observable, mergeMap, of } from "rxjs";

@Injectable()
export class InboxChannelServiceProxy {
    private request: AppHttpRequestService;

    get path(): string {
        return this.request.api.inbox.path;
    }

    constructor(_injector: Injector) {
        this.request = _injector.get(AppHttpRequestService);
    }

    getAllChatByClient(maxResultCount: number, skipCount: number): Observable<PagedResultDto<ChannelDto>> {
        let url = `${this.path}/api/services/app/Channel/GetAllChatByClient?`;
        if (maxResultCount !== null && maxResultCount !== undefined)
            url += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&";
        if (skipCount !== null && skipCount !== undefined)
            url += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";

        return this.request.get(url).pipe(mergeMap((data: any) => of(new PagedResultDto<ChannelDto>().fromJS(data, ChannelDto))));
    }

    getChatByIdClient(channelId: string): Observable<ChannelDto> {
        let url = `${this.path}/api/services/app/Channel/GetChatByIdClient?`;
        if (channelId !== null && channelId !== undefined)
            url += "ChannelId=" + encodeURIComponent("" + channelId) + "&";

        return this.request.get(url).pipe(mergeMap((data: any) => of(new ChannelDto().fromJS(data))));
    }

    getChatCrm(channelId: string, maxResultCount: number, skipCount: number): Observable<PagedResultDto<ChannelMessageDto>> {
        let url = `${this.path}/api/services/app/Chat/GetChatCrm?`;
        if (channelId !== null && channelId !== undefined)
            url += "ChannelId=" + encodeURIComponent("" + channelId) + "&";
        if (maxResultCount !== null && maxResultCount !== undefined)
            url += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&";
        if (skipCount !== null && skipCount !== undefined)
            url += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";

        return this.request.get(url).pipe(mergeMap((data: any) => of(new PagedResultDto<ChannelMessageDto>().fromJS(data, ChannelMessageDto))));
    }
}

export class ChannelDto implements IJsonConvertable<ChannelDto> {
    channelId!: string;
    name!: string;
    profilePic!: string;
    label!: string;
    companyName!: string;
    companyProfilePic!: string;
    unreadCount!: number;
    lastMessage!: ChannelMessageDto;

    init(data: any): void {
        if (data) {
            this.channelId = data["channelId"];
            this.name = data["name"];
            this.profilePic = data["profilePic"];
            this.label = data["label"];
            this.companyName = data["companyName"];
            this.companyProfilePic = data["companyProfilePic"];
            this.unreadCount = data["unreadCount"];
            this.lastMessage = data["lastMessage"] ? new ChannelMessageDto().fromJS(data["lastMessage"]) : <any>undefined;
            this.lastMessage?.format();
        }
    }

    fromJS(data: any): ChannelDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["channelId"] = this.channelId;
        data["name"] = this.name;
        data["profilePic"] = this.profilePic;
        data["label"] = this.label;
        data["companyName"] = this.companyName;
        data["companyProfilePic"] = this.companyProfilePic;
        data["unreadCount"] = this.unreadCount;
        data["lastMessage"] = this.lastMessage ? this.lastMessage.toJSON() : <any>undefined;

        return data;
    }
}

export class ChannelMessageDto implements IJsonConvertable<ChannelMessageDto> {
    id!: string;
    userId!: number;
    userName!: string;
    userPicture!: string;
    channelId!: string;
    channelName!: string;
    msg!: string;
    formatedMsg!: ChannelFormatedMessageDto;
    key!: string;
    notes!: ChannelNoteDto;
    personalContacts!: ChannelPersonalContactDto;
    isForwarded!: boolean;
    replyTo!: ChannelMessageDto;
    fileMsg!: ChannelMultimediaDto[];
    createdDate!: DateTime;
    receiverType!: ToReceiver;
    recipientId!: string;
    isDeleted!: boolean;
    mention!: ChannelMentionatedDto[];
    isCurrentUserMessage!: boolean;

    init(data: any): void {
        if (data) {
            this.id = data["id"];
            this.userId = data["userId"];
            this.userName = data["userName"];
            this.userPicture = data["userPicture"];
            this.channelId = data["channelId"];
            this.channelName = data["channelName"];
            this.msg = data["msg"];
            this.key = data["key"];
            this.notes = data["notes"] ? new ChannelNoteDto().fromJS(data["notes"]) : <any>undefined;
            this.personalContacts = data["personalContacts"] ? new ChannelPersonalContactDto().fromJS(data["personalContacts"]) : <any>undefined;
            this.isForwarded = data["isForwarded"];
            this.replyTo = data["replyTo"] ? new ChannelMessageDto().fromJS(data["replyTo"]) : <any>undefined;
            this.createdDate = data["createdDate"] ? DateTime.fromISO(data["createdDate"]) : <any>undefined;
            this.receiverType = data["receiverType"];
            this.recipientId = data["recipientId"];
            this.isDeleted = data["isDeleted"];
            this.isCurrentUserMessage = data["isCurrentUserMessage"];
            this.fileMsg = [];
            this.mention = [];

            if (Array.isArray(data["fileMsg"])) {
                for (let item of data["fileMsg"])
                    this.fileMsg.push(new ChannelMultimediaDto().fromJS(item));
            }
            if (Array.isArray(data["mention"])) {
                for (let item of data["mention"])
                    this.mention.push(new ChannelMentionatedDto().fromJS(item));
            }
        }
    }

    fromJS(data: any): ChannelMessageDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }

    format(): void {
        this.formatedMsg = new ChannelFormatedMessageDto();
        this.formatedMsg.name = (this.userName || '').split(' ')[0];

        if (this.fileMsg.length > 0) {
            const lastfileMsg = this.fileMsg[this.fileMsg.length - 1];
            const mimeType: string = isNullEmptyOrWhiteSpace(lastfileMsg.mimeType) ? '' : lastfileMsg.mimeType;

            this.formatedMsg.hasMultipleResource = this.fileMsg.length > 1;
            this.formatedMsg.hasUniqueResource = this.fileMsg.length === 1;
            this.formatedMsg.isAudio = mimeType.indexOf('audio') !== -1;
            this.formatedMsg.mediaType = this.getMediaType(mimeType);
            this.formatedMsg.hasIcon = true;
            this.formatedMsg.hasMessage = false;

            let icon: MediaType = this.getMediaType(mimeType);

            switch (icon) {
                case 'audio': {
                    this.formatedMsg.hasLocalizable = true;
                    this.formatedMsg.localizable = 'inbox.channel.audio';
                    this.formatedMsg.icon = 'icon--voice-2';
                    this.formatedMsg.message = '';
                    break;
                }
                case 'image': {
                    this.formatedMsg.hasLocalizable = true;
                    this.formatedMsg.localizable = 'inbox.channel.image';
                    this.formatedMsg.icon = 'icon--image-2';
                    this.formatedMsg.message = '';
                    break;
                }
                case 'video': {
                    this.formatedMsg.hasLocalizable = true;
                    this.formatedMsg.localizable = 'inbox.channel.video';
                    this.formatedMsg.icon = 'icon--video';
                    this.formatedMsg.message = '';
                    break;
                }
                case 'file': {
                    this.formatedMsg.hasLocalizable = false;
                    this.formatedMsg.localizable = '';
                    this.formatedMsg.icon = 'icon--file-general';
                    this.formatedMsg.message = lastfileMsg.name;
                    break;
                }
                default: {
                    this.formatedMsg.hasLocalizable = false;
                    this.formatedMsg.localizable = '';
                    break;
                }
            }
        } else {
            this.formatedMsg.hasMultipleResource = false;
            this.formatedMsg.hasUniqueResource = false;
            this.formatedMsg.hasIcon = false;
            this.formatedMsg.isAudio = false;
            this.formatedMsg.message = this.msg;
            this.formatedMsg.hasMessage = true;
        }
    }

    private getMediaType(mimeType: string): MediaType {
        return mimeType.indexOf(MediaType.Audio) !== -1 ? MediaType.Audio :
            mimeType.indexOf(MediaType.Image) !== -1 ? MediaType.Image :
                mimeType.indexOf(MediaType.Video) !== -1 ? MediaType.Video :
                    MediaType.File;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["id"] = this.id;
        data["userId"] = this.userId;
        data["userName"] = this.userName;
        data["userPicture"] = this.userPicture;
        data["channelId"] = this.channelId;
        data["channelName"] = this.channelName;
        data["msg"] = this.msg;
        data["key"] = this.key;
        data["notes"] = this.notes ? this.notes.toJSON() : <any>undefined;
        data["personalContacts"] = this.personalContacts ? this.personalContacts.toJSON() : <any>undefined;
        data["isForwarded"] = this.isForwarded;
        data["replyTo"] = this.replyTo ? this.replyTo.toJSON() : <any>undefined;
        data["createdDate"] = this.createdDate ? this.createdDate.toJSON() : <any>undefined;
        data["receiverType"] = this.receiverType;
        data["recipientId"] = this.recipientId;
        data["isDeleted"] = this.isDeleted;
        data["isCurrentUserMessage"] = this.isCurrentUserMessage;
        data["fileMsg"] = [];
        data["mention"] = [];

        if (Array.isArray(this.fileMsg)) {
            data["fileMsg"] = [];
            for (let item of this.fileMsg)
                data["fileMsg"].push(item.toJSON());
        }
        if (Array.isArray(this.mention)) {
            data["mention"] = [];
            for (let item of this.mention)
                data["mention"].push(item.toJSON());
        }

        return data;
    }
}

export class ChannelNoteDto implements IJsonConvertable<ChannelNoteDto> {
    senderId!: string;
    text!: string;
    chatId!: string;

    init(data: any): void {
        if (data) {
            this.senderId = data["senderId"];
            this.text = data["text"];
            this.chatId = data["chatId"];
        }
    }

    fromJS(data: any): ChannelNoteDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["senderId"] = this.senderId;
        data["text"] = this.text;
        data["chatId"] = this.chatId;

        return data;
    }
}

export class ChannelPersonalContactDto implements IJsonConvertable<ChannelPersonalContactDto> {
    fullName!: string;
    profilePicture!: string;
    phoneNumber!: string;

    init(data: any): void {
        if (data) {
            this.fullName = data["fullName"];
            this.profilePicture = data["profilePicture"];
            this.phoneNumber = data["phoneNumber"];
        }
    }

    fromJS(data: any): ChannelPersonalContactDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["fullName"] = this.fullName;
        data["profilePicture"] = this.profilePicture;
        data["phoneNumber"] = this.phoneNumber;

        return data;
    }
}

export class ChannelMultimediaDto implements IJsonConvertable<ChannelMultimediaDto> {
    mimeType!: string;
    formatedMymeType!: string;
    name!: string;
    size!: string;
    url!: string;
    deprecatedMms3Url!: string;
    filehash!: string;
    mediaKey!: string;
    type!: string;
    typeMultimetia!: TypeMultimetia;

    init(data: any): void {
        if (data) {
            this.mimeType = data["mimeType"];
            this.formatedMymeType = this.formatMymeType(data["name"]);
            this.name = data["name"];
            this.size = data["size"];
            this.url = data["url"];
            this.deprecatedMms3Url = data["deprecatedMms3Url"];
            this.filehash = data["filehash"];
            this.mediaKey = data["mediaKey"];
            this.type = data["type"];
            this.typeMultimetia = data["typeMultimetia"];
        }
    }

    fromJS(data: any): ChannelMultimediaDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["mimeType"] = this.mimeType;
        data["name"] = this.name;
        data["size"] = this.size;
        data["url"] = this.url;
        data["deprecatedMms3Url"] = this.deprecatedMms3Url;
        data["filehash"] = this.filehash;
        data["mediaKey"] = this.mediaKey;
        data["type"] = this.type;
        data["typeMultimetia"] = this.typeMultimetia;

        return data;
    }

    private formatMymeType(name: string) {
        const splitedName = name.split('.');
        return splitedName[splitedName.length - 1];
    }
}

export class ChannelMentionatedDto implements IJsonConvertable<ChannelMentionatedDto> {
    userId!: number;
    value!: string;

    init(data: any): void {
        if (data) {
            this.userId = data["userId"];
            this.value = data["value"];
        }
    }

    fromJS(data: any): ChannelMentionatedDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["userId"] = this.userId;
        data["value"] = this.value;

        return data;
    }
}

export class ChannelFormatedMessageDto implements IJsonConvertable<ChannelFormatedMessageDto> {
    name!: string;
    icon!: string;
    hasMultipleResource!: boolean;
    hasUniqueResource!: boolean;
    hasIcon!: boolean;
    hasLocalizable!: boolean;
    isAudio!: boolean;
    mediaType!: MediaType;
    localizable!: string;
    hasMessage!: boolean;
    message!: string;

    init(data: any): void {
        if (data) {
            this.name = data["name"];
            this.icon = data["icon"];
            this.hasIcon = data["hasIcon"];
            this.hasLocalizable = data["hasLocalizable"];
            this.localizable = data["localizable"];
            this.message = data["message"];
        }
    }

    fromJS(data: any): ChannelFormatedMessageDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["name"] = this.name;
        data["icon"] = this.icon;
        data["hasIcon"] = this.hasIcon;
        data["hasLocalizable"] = this.hasLocalizable;
        data["localizable"] = this.localizable;
        data["message"] = this.message;

        return data;
    }
}

export const enum TypeMultimetia {
    None,
    Whatsapp
}

export const enum ToReceiver {
    Channel,
    Private,
    MySpace,
    CRM
}

export enum MediaType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    File = 'file'
}