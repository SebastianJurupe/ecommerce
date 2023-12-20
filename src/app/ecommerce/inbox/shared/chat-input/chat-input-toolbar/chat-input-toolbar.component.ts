import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { VoiceRecorder } from '@geor360/capacitor-voice-recorder';
import { isNullEmptyOrWhiteSpace } from '@geor360/core';
import { Platform } from '@ionic/angular';
import { ChatResourceDto, base64ToFile } from '@shared/proxies/inbox/chat.proxy';

@Component({
    selector: 'inbox-chat-input-toolbar',
    templateUrl: 'chat-input-toolbar.component.html',
    styleUrls: [
        'chat-input-toolbar.component.scss'
    ]
})
export class InboxChatInputToolbarComponent implements OnInit, OnDestroy {

    private platform: Platform;
    private _recording: boolean = false;
    private _paused: boolean = false;
    private _empty: boolean = true;

    @Input() id!: string;
    @Input() cursorPosition!: number;

    @Input() get empty(): boolean {
        return this._empty;
    }

    @Input() get recording(): boolean {
        return this._recording;
    }

    @Input() get paused(): boolean {
        return this._paused;
    }

    set empty(value: boolean) {
        this._empty = value;
        this.emptyChange.emit(value);
    }

    set recording(value: boolean) {
        this._recording = value;
        this.recordingChange.emit(value);
    }

    set paused(value: boolean) {
        this._paused = value;
        this.pausedChange.emit(value);
    }

    time: string = '0:00';
    miliseconds: number = 0;
    amplitudes: number[] = [];
    native: boolean = false;

    @Output() recordingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() pausedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() emptyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output() onAddFile: EventEmitter<void> = new EventEmitter<void>();
    @Output() onAddImage: EventEmitter<void> = new EventEmitter<void>();
    @Output() onAddVideo: EventEmitter<void> = new EventEmitter<void>();

    @Output() onSend: EventEmitter<void> = new EventEmitter<void>();
    @Output() onSendAudio: EventEmitter<ChatResourceDto> = new EventEmitter<ChatResourceDto>();
    @Output() onSendImage: EventEmitter<ChatResourceDto> = new EventEmitter<ChatResourceDto>();

    private mode: 'ios' | 'web' | 'android';
    private uppercase: boolean = false;
    private interval!: NodeJS.Timeout;

    constructor(injector: Injector) {
        this.platform = injector.get(Platform);
        this.mode = this.platform.is('capacitor') && this.platform.is('android') ? 'android' :
            this.platform.is('capacitor') && this.platform.is('ios') ? 'ios' : 'web';
        this.native = this.mode == 'android' || this.mode == 'ios';
    }

    ngOnInit(): void {
        VoiceRecorder.watchWave({}, (result) => {
            if (this.paused)
                return;

            if (result !== undefined && result !== null && result.amplitude !== null && result.amplitude !== undefined) {

                let newData: number = 0;

                switch (this.mode) {
                    case 'web': {
                        newData = (result.amplitude * 200) + 0.5;
                        break;
                    }
                    case 'android': {
                        newData = Math.trunc(result.amplitude === 0 ? 2 : (result.amplitude / 150));
                    }
                }

                this.amplitudes.push(newData);
            }
        });

        this.interval = setInterval(() => {
            if (this.paused)
                return;

            this.miliseconds += 50;

            const minutes: number = Math.floor((this.miliseconds / 60 / 1000) << 0);
            const seconds: number = Math.floor((this.miliseconds / 1000) % 60);

            this.time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 50);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    toggleCase(): void {
        //Get current value in content editable
        let content = document.getElementById(this.id)!.innerHTML;

        if (!isNullEmptyOrWhiteSpace(content)) {
            let selection = window.getSelection()!;
            let range = selection.getRangeAt(0);
            let start = range.startOffset;
            let end = range.endOffset;

            //Change text to case required
            let newContent = this.uppercase ? content.toLocaleLowerCase() : content.toUpperCase();

            //Set text
            document.getElementById(this.id)!.innerHTML = newContent;

            this.uppercase = !this.uppercase;

            //Restore cursor position
            selection = window.getSelection()!;
            range = document.createRange();
            range.setStart(document.getElementById(this.id)!.childNodes[0], start);
            range.setEnd(document.getElementById(this.id)!.childNodes[0], end);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    async sendAudio(): Promise<void> {
        VoiceRecorder.stopRecording().then((data) => {

            this.recording = false;
            this.paused = false;
            this.time = '0:00';
            this.miliseconds = 0;
            this.amplitudes = [];

            const fileName: string = new Date().getTime().toString() + '.' + data.value.mimeType.split('/')[1].split(';')[0];
            const file: globalThis.File = base64ToFile(data.value.recordDataBase64, fileName, data.value.mimeType);

            const resource: ChatResourceDto = new ChatResourceDto({
                name: fileName,
                file: file,
                url: undefined,
                size: file
            });

            this.onSendAudio.emit(resource);
        });
    }

    async startVoiceRecord(): Promise<void> {
        const status = await VoiceRecorder.getCurrentStatus();

        if (status.status == 'PAUSED')
            await VoiceRecorder.stopRecording();
        if (status.status == 'RECORDING')
            await VoiceRecorder.stopRecording();

        const canDeviceVoiceRecord = await VoiceRecorder.canDeviceVoiceRecord();

        if (canDeviceVoiceRecord.value) {
            const hasPermissions = await VoiceRecorder.requestAudioRecordingPermission();

            if (hasPermissions.value) {
                const startRecording = await VoiceRecorder.startRecording();

                if (startRecording.value) {
                    this.recording = true;
                    this.paused = false;
                    this.time = '0:00';
                    this.miliseconds = 0;
                } else {

                }
            } else {

            }

        } else {

        }
    }

    async stopVoiceRecord(): Promise<void> {

        await VoiceRecorder.stopRecording();

        this.recording = false;
        this.paused = false;
        this.time = '0:00';
        this.miliseconds = 0;
        this.amplitudes = [];
    }

    async pauseVoiceRecord(): Promise<void> {
        if (this.paused) {
            VoiceRecorder.resumeRecording().then(() => {
                this.paused = false;
            });
        } else {
            VoiceRecorder.pauseRecording().then(() => {
                this.paused = true;
            });
        }
    }

}