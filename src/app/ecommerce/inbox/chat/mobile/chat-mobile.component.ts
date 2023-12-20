import { Component, Injector } from '@angular/core';
import { RenderService } from '@shared/services/render.service';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';

@Component({
    selector: 'app-chat-mobile',
    templateUrl: 'chat-mobile.component.html',
    styleUrls: [
        'chat-mobile.component.scss'
    ]
})
export class InboxChatMobileComponent implements ViewWillEnter, ViewWillLeave { 
    private render: RenderService;

    constructor(injector: Injector) {
        this.render = injector.get(RenderService);
    }

    ionViewWillEnter(): void {
        this.render.init();
        this.render.show();
    }

    ionViewWillLeave(): void {
        this.render.hide();
    }
}