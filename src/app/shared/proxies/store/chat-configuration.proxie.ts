import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable, mergeMap, of } from "rxjs";

@Injectable()
export class ChatConfigurationServiceProxy {
    private request: AppHttpRequestService;

    get path(): string {
        return this.request.api.store.path;
    }

    constructor(_injector: Injector) {
        this.request = _injector.get(AppHttpRequestService);
    }

    isEnabled(): Observable<ChatEnabledDto> {
        const url = `${this.path}/api/services/app/ChatConfiguration/IsEnabled`;
        return this.request.post(url).pipe(mergeMap((data: any) => of(new ChatEnabledDto().fromJS(data))));
    }
}

export class ChatEnabledDto implements IFromJsonConvertable<ChatEnabledDto>{
    isEnabled!: boolean;
    configuration!: ChatConfigurationDto;

    init(data: any): void {
        if (data) {
            this.isEnabled = data["isEnabled"];
            this.configuration = data["configuration"] ? new ChatConfigurationDto().fromJS(data["configuration"]) : <any>undefined;
        }
    }

    fromJS(data: any): ChatEnabledDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }
}

export class ChatConfigurationDto implements IFromJsonConvertable<ChatConfigurationDto>{
    accessToken!: string;

    init(data: any): void {
        if (data) {
            this.accessToken = data["accessToken"];
        }
    }

    fromJS(data: any): ChatConfigurationDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }
}