import { Injectable, Injector } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RenderService {

    deviceWidth!: number;
    deviceHeight!: number;

    onChange: Subject<'show' | 'hide'> = new Subject<'show' | 'hide'>();

    private platform: Platform;

    constructor(injector: Injector) {
        this.platform = injector.get(Platform);
    }

    init(): void {
        this.platform
            .ready()
            .then(() => {
                setTimeout(() => {
                    this.deviceHeight = this.platform.height();
                    this.deviceWidth = this.platform.width();
                }, 250);
            });
    }

    show(): void {
        this.onChange.next('show');
    }

    hide(): void {
        this.onChange.next('hide');
    }
}