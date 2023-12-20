import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IToJsonConvertable } from "@geor360/core";
import { Observable, mergeMap, of } from "rxjs";
import { ChannelMessageDto } from "./channel.proxy";

@Injectable()
export class InboxChatServiceProxy {
    private request: AppHttpRequestService;

    get path(): string {
        return this.request.api.inbox.path;
    }

    constructor(_injector: Injector) {
        this.request = _injector.get(AppHttpRequestService);
    }

    create(input: ChatCreateDto): Observable<ChannelMessageDto> {
        const url = `${this.path}/api/services/app/Chat/Create`;
        const body = input.toJSON();

        return this.request.post(url, body).pipe(mergeMap((data: any) => of(new ChannelMessageDto().fromJS(data))));
    }
}

export interface IChatCreateDto {
    channelId: string;
    msg: string;
    key: string;
    msgId: string | undefined;
    usersIds: number[] | undefined;
    attachments: ChatResourceDto[] | undefined;
}

export class ChatCreateDto implements IChatCreateDto, IToJsonConvertable<ChatCreateDto> {
    channelId!: string;
    msg!: string;
    key!: string;
    msgId!: string;
    usersIds!: number[];
    attachments!: ChatResourceDto[];

    constructor(data?: IChatCreateDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property)) {
                    (<any>this)[property] = (<any>data)[property];
                }
            }
        }
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["channelId"] = this.channelId;
        data["msg"] = this.msg;
        data["key"] = this.key;
        data["msgId"] = this.msgId;
        data["usersIds"] = [];
        data["attachments"] = [];

        if (Array.isArray(this.usersIds))
            for (let item of this.usersIds)
                data["usersIds"].push(item);
        if (Array.isArray(this.attachments))
            for (let item of this.attachments)
                data["attachments"].push(item.toJSON());

        return data;
    }
}

export interface IChatResourceDto {
    name: string;
    file: globalThis.File;
    url: string;
    size: string;
    fileToken?: string;
    key?: string;
}

export class ChatResourceDto implements IChatResourceDto, IToJsonConvertable<ChatResourceDto> {
    name!: string;
    file!: globalThis.File;
    url!: string;
    size!: string;
    fileName?: string;
    fileToken?: string;
    key?: string;

    constructor(data?: any) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property)) {
                    (<any>this)[property] = (<any>data)[property];
                }
            }
        }
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["fileName"] = this.fileName;
        data["fileToken"] = this.fileToken;
        data["key"] = this.key;

        return data;
    }
}

export const generateUrl = (file: globalThis.File): string => {
    return isImage(file.name) ?
        window.URL.createObjectURL(file) :
        generateIcon(file.name);
}

export const generateIcon = (value: string): string => {
    if (value.lastIndexOf(".") == -1)
        return "";

    const extension: string = value.substring(value.lastIndexOf(".") + 1).toLocaleLowerCase();

    switch (extension) {
        case "jpg": return "/assets/icons/lib/file-general.svg";
        case "jpeg": return "/assets/icons/lib/file-general.svg";
        case "jpe": return "/assets/icons/lib/file-general.svg";
        case "png": return "/assets/icons/lib/file-general.svg";
        case "pdf": return "/assets/icons/lib/file-pdf.svg";
        case "xlsx": return "/assets/icons/lib/file-calc.svg";
        case "xls": return "/assets/icons/lib/file-calc.svg";
        case "csv": return "/assets/icons/lib/video.svg";
        case "doc": return "/assets/icons/lib/file-doc.svg";
        case "docx": return "/assets/icons/lib/file-doc.svg";
        case "txt": return "/assets/icons/lib/file-general.svg";
        case "json": return "/assets/icons/lib/file-general.svg";
        case "zip": return "/assets/icons/lib/file-general.svg";
        case "odt": return "/assets/icons/lib/file-doc.svg";
        case "ogg": return "/assets/icons/lib/file-general.svg";
        case "mp3": return "/assets/icons/lib/file-general.svg";
        case "mp4": return "/assets/icons/lib/file-general.svg";
        default: return "/assets/icons/lib/file-general.svg";
    }
}

export const bytesToSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0)
        return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return roundNumber(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export const roundNumber = (number: number, length: number): number => {
    return +(Math.round((number + Number.EPSILON) * Math.pow(10, length)) / Math.pow(10, length)).toFixed(length);
}

export const isValidFile = (value: string): boolean => {

    if (value.lastIndexOf(".") == -1)
        return false;

    const extension: string = value.substring(value.lastIndexOf(".") + 1).toLocaleLowerCase();

    switch (extension) {
        case "jpg": return true;
        case "jpeg": return true;
        case "jpe": return true;
        case "png": return true;
        case "pdf": return true;
        case "xlsx": return true;
        case "xls": return true;
        case "csv": return true;
        case "doc": return true;
        case "docx": return true;
        case "txt": return true;
        case "json": return true;
        case "zip": return true;
        case "odt": return true;
        case "ogg": return true;
        case "mp3": return true;
        case "mp4": return true;
    }

    return false;
}

export const isImage = (value: string): boolean => {
    if (value.lastIndexOf(".") == -1)
        return false;

    const extension: string = value.substring(value.lastIndexOf(".") + 1).toLocaleLowerCase();

    switch (extension) {
        case "jpg": return true;
        case "jpeg": return true;
        case "jpe": return true;
        case "png": return true;
    }

    return false;
}

export const getCaretPosition = (element: any) => {
    let selection = window.getSelection()!;
    let range = selection.getRangeAt(0);
    let preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}

export const setCursorAtPosition = (element: HTMLElement, position: number) => {
    let range = document.createRange();
    let sel = window.getSelection()!;

    traverseNodes(element, (node) => {
        if (node.nodeType == 3) {
            if (position <= node.length) {
                range.setStart(node, position);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return true;
            } else {
                position -= node.length;
            }
        }

        return false;
    });
}

export const traverseNodes = (node: any, callback: (node: any) => boolean) => {
    if (callback(node))
        return true;

    node = node.firstChild;

    while (node) {
        if (traverseNodes(node, callback))
            return true;

        node = node.nextSibling;
    }

    return false;
}

export const random = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
}

export const base64ToFile = (dataurl: string, filename: string, mimeType: string): globalThis.File => {
    const bstr = atob(dataurl);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--)
        u8arr[n] = bstr.charCodeAt(n);

    return new File([u8arr], filename, { type: mimeType });
}