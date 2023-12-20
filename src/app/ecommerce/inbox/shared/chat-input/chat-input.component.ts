import { HttpResponse } from '@angular/common/http';
import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { arrayBufferToFile, isNullEmptyOrWhiteSpace } from '@geor360/core';
import { ChannelDto } from '@shared/proxies/inbox/channel.proxy';
import { ChatCreateDto, ChatResourceDto, InboxChatServiceProxy, generateUrl } from '@shared/proxies/inbox/chat.proxy';
import { InboxMultimediaServiceProxy } from '@shared/proxies/inbox/multimedia.proxy';
import { InboxService } from '../../services/inbox.service';
import { Platform } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import * as uuid from 'uuid';

@Component({
    selector: 'inbox-chat-input',
    templateUrl: 'chat-input.component.html',
    styleUrls: [
        'chat-input.component.scss'
    ]
})
export class InboxChatInputComponent implements OnInit, OnDestroy {

    private inboxChatServiceProxy: InboxChatServiceProxy;
    private inboxMultimediaServiceProxy: InboxMultimediaServiceProxy;
    private service: InboxService;
    private platform: Platform;

    @Input() id: string = 'chat-input';
    @Input() channel!: ChannelDto;

    recording: boolean = false;
    paused: boolean = false;
    empty: boolean = true;
    cursorPosition: number = 0;
    resources: ChatResourceDto[] = [];
    native: boolean = false;

    constructor(injector: Injector) {
        this.inboxChatServiceProxy = injector.get(InboxChatServiceProxy);
        this.inboxMultimediaServiceProxy = injector.get(InboxMultimediaServiceProxy);
        this.service = injector.get(InboxService);
        this.platform = injector.get(Platform);

        this.native = this.platform.is('capacitor');
    }

    ngOnInit(): void {
        window.onclick = (event) => {
            if (event && event.target && !(<any>event).target.matches('.chat-input__action')) {
                this.hideDropDowns();
            }
        }
    }

    ngOnDestroy(): void {
        window.onclick = () => { }
    }

    onAddFile(): void {

        if (this.platform.is('capacitor')) {

            FilePicker.pickFiles({
                multiple: true
            }).then((pickerResult) => {

                for (let pickedFile of pickerResult.files) {
                    let url: string = (<any>window).Ionic.WebView.convertFileSrc(pickedFile.path);
                    let name: string = pickedFile.name;
                    let type: string = pickedFile.mimeType;

                    this.inboxMultimediaServiceProxy.download('GET', url).subscribe({
                        next: (data) => {

                            let fileReader = new FileReader();
                            fileReader.onload = (event) => {
                                const file: globalThis.File = arrayBufferToFile((<any>event).target.result, type, name);

                                const resource: ChatResourceDto = new ChatResourceDto({
                                    name: file.name,
                                    file: file,
                                    url: generateUrl(file),
                                    size: file.size
                                });

                                this.resources.push(resource);
                            };

                            fileReader.readAsArrayBuffer(data);
                        }
                    });

                }
            });

        } else {

            let input = document.querySelector(
                '#_capacitor-camera-input',
            ) as HTMLInputElement;

            const cleanup = () => {
                input.parentNode?.removeChild(input);
            };

            if (!input) {
                input = document.createElement('input') as HTMLInputElement;
                input.id = '_capacitor-camera-input';
                input.type = 'file';
                input.hidden = true;
                document.body.appendChild(input);
                input.addEventListener('change', (_e: any) => {
                    const file = input.files![0];

                    const resource: ChatResourceDto = new ChatResourceDto({
                        name: file.name,
                        file: file,
                        url: generateUrl(file),
                        size: file.size
                    });

                    this.resources.push(resource);

                    cleanup();
                });
            }

            input.accept = 'image/*';
            (input as any).capture = true;

            input.click();
        }
    }

    onAddImage(): void {
        FilePicker.pickImages({
            multiple: true
        }).then((pickerResult) => {

            for (let pickedFile of pickerResult.files) {
                let url: string = (<any>window).Ionic.WebView.convertFileSrc(pickedFile.path);
                let name: string = pickedFile.name;
                let type: string = pickedFile.mimeType;

                this.inboxMultimediaServiceProxy.download('GET', url).subscribe({
                    next: (data) => {

                        let fileReader = new FileReader();
                        fileReader.onload = (event) => {
                            const file: globalThis.File = arrayBufferToFile((<any>event).target.result, type, name);

                            const resource: ChatResourceDto = new ChatResourceDto({
                                name: file.name,
                                file: file,
                                url: generateUrl(file),
                                size: file.size
                            });

                            this.resources.push(resource);
                        };

                        fileReader.readAsArrayBuffer(data);
                    }
                });

            }
        });
    }

    onAddVideo(): void {
        FilePicker.pickVideos({
            multiple: true
        }).then((pickerResult) => {

            for (let pickedFile of pickerResult.files) {
                let url: string = (<any>window).Ionic.WebView.convertFileSrc(pickedFile.path);
                let name: string = pickedFile.name;
                let type: string = pickedFile.mimeType;

                this.inboxMultimediaServiceProxy.download('GET', url).subscribe({
                    next: (data) => {

                        let fileReader = new FileReader();
                        fileReader.onload = (event) => {
                            const file: globalThis.File = arrayBufferToFile((<any>event).target.result, type, name);

                            const resource: ChatResourceDto = new ChatResourceDto({
                                name: file.name,
                                file: file,
                                url: generateUrl(file),
                                size: file.size
                            });

                            this.resources.push(resource);
                        };

                        fileReader.readAsArrayBuffer(data);
                    }
                });

            }
        });
    }

    onSend(): void {
        let message: string = document.getElementById(this.id)!.textContent!;

        if (isNullEmptyOrWhiteSpace(message) && this.resources.length == 0)
            return;

        if (isNullEmptyOrWhiteSpace(message))
            message = '';

        if (this.resources.length == 0) {

            const chatMessage = new ChatCreateDto({
                msg: message,
                key: uuid.v4(),
                msgId: undefined,
                usersIds: [],
                attachments: undefined,
                channelId: this.channel.channelId
            });

            this.clearInput();

            this.inboxChatServiceProxy
                .create(chatMessage)
                .subscribe({
                    next: (newMessage) => {
                        newMessage.format();
                        this.service.onMessage.next(newMessage);
                    }
                });
        } else {

            const chatMessage = new ChatCreateDto({
                msg: message,
                key: uuid.v4(),
                msgId: undefined,
                usersIds: [],
                attachments: undefined,
                channelId: this.channel.channelId
            });

            this.clearInput();

            let resources: ChatResourceDto[] = this.resources.map(p => {
                let newResource = new ChatResourceDto();
                newResource.name = p.name;
                newResource.file = p.file;
                newResource.url = p.url;
                newResource.size = p.size;
                newResource.fileName = p.fileName;
                newResource.fileToken = p.fileToken;
                newResource.key = p.key;

                return newResource;
            });

            this.resources = [];

            this.inboxMultimediaServiceProxy.uploads(resources.map(p => p.file)).subscribe({
                next: (event) => {
                    if (event instanceof HttpResponse) {
                        if (event.body.success) {
                            const tokens: string = event.body.result.fileTokens;
                            let index: number = 0;

                            for (let token of tokens) {
                                resources[index].fileToken = token;
                                resources[index].fileName = resources[index].file.name;
                                resources[index].fileToken = token;
                                resources[index].key = uuid.v4();

                                index++;
                            }

                            chatMessage.attachments = resources;

                            this.inboxChatServiceProxy.create(chatMessage).subscribe({
                                next: (newMessage) => {
                                    newMessage.format();
                                    this.service.onMessage.next(newMessage);
                                }
                            });

                        } else {

                        }
                    }
                }
            });
        }
    }

    onSendAudio(resource: ChatResourceDto) {
        let chatMessage = new ChatCreateDto({
            msg: '',
            key: uuid.v4(),
            msgId: undefined,
            usersIds: [],
            attachments: [],
            channelId: this.channel.channelId,
        });

        this.inboxMultimediaServiceProxy.uploads([resource.file]).subscribe({
            next: (event) => {
                if (event instanceof HttpResponse) {
                    if (event.body.success) {
                        const token: string = event.body.result.fileTokens[0];

                        resource.fileName = resource.file.name;
                        resource.fileToken = token;
                        resource.key = uuid.v4();

                        chatMessage.attachments.push(resource);

                        this.inboxChatServiceProxy.create(chatMessage).subscribe({
                            next: (newMessage) => {
                                newMessage.format();
                                this.service.onMessage.next(newMessage);
                            }
                        });
                    } else {

                    }
                }
            }
        });
    }

    onSendImage(resource: ChatResourceDto) {

        let chatMessage = new ChatCreateDto({
            msg: '',
            key: uuid.v4(),
            msgId: undefined,
            usersIds: [],
            attachments: [],
            channelId: this.channel.channelId
        });

        this.inboxMultimediaServiceProxy.uploads([resource.file]).subscribe({
            next: (event) => {
                if (event instanceof HttpResponse) {
                    if (event.body.success) {
                        const token: string = event.body.result.fileTokens[0];

                        resource.fileName = resource.name;
                        resource.fileToken = token;
                        resource.key = uuid.v4();

                        chatMessage.attachments.push(resource);

                        this.inboxChatServiceProxy.create(chatMessage).subscribe({
                            next: (newMessage) => {
                                newMessage.format();
                                this.service.onMessage.next(newMessage);
                            }
                        });
                    } else {

                    }
                }
            }
        });
    }

    onPasteFile(event: ChatResourceDto): void {
        this.resources.push(event);
    }

    private hideDropDowns(): void {
        let dropdowns = document.getElementsByClassName("chat-input__action");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }

    private clearInput(): void {
        const element: HTMLElement = document.getElementById(this.id)!;

        element.textContent = '';
        this.empty = true;

        this.hideDropDowns();

        element.focus();
    }
}