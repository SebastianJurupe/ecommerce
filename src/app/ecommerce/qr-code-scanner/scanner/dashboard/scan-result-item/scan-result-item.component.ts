import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'scan-result-item',
    templateUrl: 'scan-result-item.component.html',
    styleUrls: [
        'scan-result-item.component.scss'
    ]
})
export class ScanResultItemComponent {

    @Input() user: any;

    @Output() onUserChat: EventEmitter<any> = new EventEmitter<any>();

}