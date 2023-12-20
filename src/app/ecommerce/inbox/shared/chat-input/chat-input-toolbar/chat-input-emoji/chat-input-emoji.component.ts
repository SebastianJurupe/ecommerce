import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppLocalizationService, AppThemeService } from '@geor360/core';
import { setCursorAtPosition } from '@shared/proxies/inbox/chat.proxy';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

interface IEmojiTranslation {
    search: string;
    emojilist: string;
    notfound: string;
    clear: string;
    categories: {
        search: string;
        recent: string;
        people: string;
        nature: string;
        foods: string;
        activity: string;
        places: string;
        objects: string;
        symbols: string;
        flags: string;
        custom: string;
    },
    skintones: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
    }
};

@Component({
    selector: 'inbox-chat-input-emoji',
    templateUrl: 'chat-input-emoji.component.html',
    styleUrls: [
        'chat-input-emoji.component.scss'
    ]
})
export class InboxChatInputEmojiComponent {

    private _empty: boolean = true;

    private localization: AppLocalizationService;
    private theme: AppThemeService;

    @Input() id!: string;
    @Input() cursorPosition!: number;
    @Input() get empty(): boolean {
        return this._empty;
    }

    set empty(value: boolean) {
        this._empty = value;
        this.emptyChange.emit(value);
    }

    @Output() emptyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    lang!: 'es' | 'en';
    mode!: 'dark' | 'light';
    texts!: IEmojiTranslation;

    constructor(injector: Injector) {
        this.localization = injector.get(AppLocalizationService);
        this.theme = injector.get(AppThemeService);

        this.lang = this.localization.currentLanguage == 'en_US' ? 'en' : 'es';
        this.mode = this.theme.theme;

        this.texts = {
            search: this.localization.localize('inbox.dashboard.emoji.search', 'ecommerce'),
            emojilist: this.localization.localize('inbox.dashboard.emoji.emojilist', 'ecommerce'),
            notfound: this.localization.localize('inbox.dashboard.emoji.notfound', 'ecommerce'),
            clear: this.localization.localize('inbox.dashboard.emoji.clear', 'ecommerce'),
            categories: {
                search: this.localization.localize('inbox.dashboard.emoji.search', 'ecommerce'),
                recent: this.localization.localize('inbox.dashboard.emoji.recent', 'ecommerce'),
                people: this.localization.localize('inbox.dashboard.emoji.people', 'ecommerce'),
                nature: this.localization.localize('inbox.dashboard.emoji.nature', 'ecommerce'),
                foods: this.localization.localize('inbox.dashboard.emoji.foods', 'ecommerce'),
                activity: this.localization.localize('inbox.dashboard.emoji.activity', 'ecommerce'),
                places: this.localization.localize('inbox.dashboard.emoji.places', 'ecommerce'),
                objects: this.localization.localize('inbox.dashboard.emoji.objects', 'ecommerce'),
                symbols: this.localization.localize('inbox.dashboard.emoji.symbols', 'ecommerce'),
                flags: this.localization.localize('inbox.dashboard.emoji.flags', 'ecommerce'),
                custom: this.localization.localize('inbox.dashboard.emoji.custom', 'ecommerce'),
            },
            skintones: {
                1: this.localization.localize('inbox.dashboard.emoji.skin1', 'ecommerce'),
                2: this.localization.localize('inbox.dashboard.emoji.skin2', 'ecommerce'),
                3: this.localization.localize('inbox.dashboard.emoji.skin3', 'ecommerce'),
                4: this.localization.localize('inbox.dashboard.emoji.skin4', 'ecommerce'),
                5: this.localization.localize('inbox.dashboard.emoji.skin5', 'ecommerce'),
                6: this.localization.localize('inbox.dashboard.emoji.skin6', 'ecommerce'),
            }
        }
    }

    onClick(event: any): void {
        event.stopPropagation();
    }

    onEmojiSelected(event: EmojiEvent): void {
        event.$event?.stopPropagation();

        let emoji = event.emoji.native!;
        let contentEditable = document.getElementById(this.id)!;

        contentEditable?.focus();
        setCursorAtPosition(contentEditable, this.cursorPosition);

        // Save current cursor position
        let selection = window.getSelection()!;
        let range = selection.getRangeAt(0);

        //Insert Emoji
        let emojiNode = document.createTextNode(emoji);
        range.deleteContents();
        range.insertNode(emojiNode);

        //Move cursor to the inserted emoji
        range.setStartAfter(emojiNode);
        range.setEndAfter(emojiNode);
        selection.removeAllRanges();
        //Unselect text
        selection.addRange(range);

        const newValue: string = (contentEditable?.textContent || '');
        this.empty = newValue.length == 0;
        contentEditable.focus();
    }
}