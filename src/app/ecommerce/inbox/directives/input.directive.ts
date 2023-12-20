import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { ChatResourceDto, isValidFile, generateUrl, bytesToSize, setCursorAtPosition, getCaretPosition } from "@shared/proxies/inbox/chat.proxy";

@Directive({
    selector: 'div[inbox]',
    exportAs: 'inbox'
})
export class InboxInputDirective {

    private _cursorPosition!: number;
    private _empty!: boolean;

    @Input() get cursorPosition(): number {
        return this._cursorPosition;
    }

    set cursorPosition(value: number) {
        this._cursorPosition = value;
        this.cursorPositionChange.emit(value);
    }

    @Input() get empty(): boolean {
        return this._empty;
    }

    set empty(value: boolean) {
        this._empty = value;
        this.emptyChange.emit(value);
    }

    @Output() onPasteFile: EventEmitter<ChatResourceDto> = new EventEmitter<ChatResourceDto>();
    @Output() onEnter: EventEmitter<void> = new EventEmitter<void>();
    @Output() cursorPositionChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() emptyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private el: ElementRef<HTMLElement>) {

    }

    @HostListener("keypress", ['$event'])
    onKeypress(event: any): void {
        if (!event.shiftKey && event.which == 13)
            this.onEnter.emit();

        return (event.shiftKey && event.which == 13) || (event.which != 13);
    }

    @HostListener("keydown", ['$event'])
    onKeyDown(event: any): void {

    }

    @HostListener("focus", ['$event'])
    onFocus(event: any): void {
        event?.stopPropagation();
        let contentEditable = this.el.nativeElement;

        contentEditable?.focus();
        setCursorAtPosition(contentEditable, this.cursorPosition);
    }

    @HostListener("input", ['$event'])
    onInput(event: any): void {
        const newValue: string = (this.el.nativeElement.textContent || '');
        this.empty = newValue.length == 0;
    }

    @HostListener("blur", ['$event'])
    onBlur(event: any): void {
        this.cursorPosition = getCaretPosition(this.el.nativeElement);
    }

    @HostListener("paste", ['$event'])
    onPaste(event: any): void {
        event.preventDefault();

        console.log(event)

        let items = (event.clipboardData || event.originalEvent.clipboardData).items;

        let hasFiles: boolean = false;

        for (let item of items) {
            if (item.kind === 'file')
                hasFiles = true;
        }

        if (hasFiles) {
            for (let index in items) {
                const item = items[index];

                if (item.kind === 'file') {
                    const file: globalThis.File = item.getAsFile();

                    if (isValidFile(file.name)) {
                        this.onPasteFile.emit(new ChatResourceDto({
                            name: file.name,
                            file: file,
                            url: generateUrl(file),
                            size: bytesToSize(file.size)
                        }));
                    }
                }
            }
        } else {
            let text: string;
            let clp = (event.originalEvent || event).clipboardData;
            if (clp === undefined || clp === null) {
                text = (<any>window).clipboardData.getData("text").replace(/\r/g, '').replace(/\n/g, '') || "";
                if (text !== "") {
                    text = text.replace(/<[^>]*>/g, "");
                    if ((<any>window).getSelection) {
                        let newNode = document.createElement("span");
                        newNode.innerHTML = text;
                        (<any>window).getSelection().getRangeAt(0).insertNode(newNode);
                    } else {
                        (<any>document).selection.createRange().pasteHTML(text);
                    }
                }
            } else {
                text = clp.getData('text/plain') || "";
                if (text !== "") {
                    text = text.replace(/<[^>]*>/g, "");
                    document.execCommand('insertText', false, text);
                }
            }
        }
    }
}