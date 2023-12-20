import { Component, Injector } from '@angular/core';
import { ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { RenderService } from '@shared/services/render.service';

@Component({
    selector: 'app-chat-tablet',
    templateUrl: 'chat-tablet.component.html',
    styleUrls: [
        'chat-tablet.component.scss'
    ]
})
export class InboxChatTabletComponent implements ViewWillEnter, ViewWillLeave { 
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