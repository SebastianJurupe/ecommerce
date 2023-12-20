import { Component, Injector } from '@angular/core';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { RenderService } from '@shared/services/render.service';

@Component({
    selector: 'app-chat-desktop',
    templateUrl: 'chat-desktop.component.html',
    styleUrls: [
        'chat-desktop.component.scss'
    ]
})
export class InboxChatDesktopComponent implements ViewWillEnter, ViewWillLeave { 
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