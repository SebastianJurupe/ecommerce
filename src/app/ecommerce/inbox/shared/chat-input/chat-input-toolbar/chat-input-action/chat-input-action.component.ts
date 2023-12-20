import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'inbox-chat-input-action',
    templateUrl: 'chat-input-action.component.html',
    styleUrls: [
        'chat-input-action.component.scss'
    ]
})
export class InboxChatInputActionComponent  {

    @Input() icon!: string;
    @Input() color: string = 'dark';
    @Input() disabled: boolean = false;
    
    @Output() onAction: EventEmitter<void> = new EventEmitter<void>();

    toggle(event: any, element: any) {
        event.stopPropagation();

        if (element.classList.contains('show')) {
            element.classList.toggle('show');
        } else {
            this.hide();
            element.classList.toggle('show');
        }

        this.onAction.emit();
    }

    private hide(): void {
        let dropdowns = document.getElementsByClassName("chat-input__action");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}