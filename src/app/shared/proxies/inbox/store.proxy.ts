import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable, mergeMap, of } from "rxjs";

@Injectable()
export class InboxStoreServiceProxy {
    private request: AppHttpRequestService;

    get path(): string {
        return this.request.api.inbox.path;
    }

    constructor(_injector: Injector) {
        this.request = _injector.get(AppHttpRequestService);
    }

    verifyToken(token: string): Observable<InboxStoreVerifyDto> {
        const url = `${this.path}/api/services/app/Store/VerifyToken`;
        const body = JSON.stringify({
            token: token
        });

        return this.request.post(url, body).pipe(mergeMap((data: any) => of(new InboxStoreVerifyDto().fromJS(data))));
    }
}

export class InboxStoreVerifyDto implements IFromJsonConvertable<InboxStoreVerifyDto>{
    channelId!: string;

    init(data: any): void {
        if (data) {
            this.channelId = data["channelId"];
        }
    }

    fromJS(data: any): InboxStoreVerifyDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }
}