import { mergeMap } from 'rxjs/operators';
import { Injectable, Injector } from "@angular/core";
import { AppCountryDto, AppHttpRequestService, AppServiceVersionDto, AppUserDto } from "@geor360/core";
import { Observable, of } from "rxjs";
import { IFromJsonConvertable } from "@geor360/core";

@Injectable()
export class SessionServiceProxy {
    private request: AppHttpRequestService;

    get path(): string {
        return this.request.api.store.path;
    }

    constructor(_injector: Injector) {
        this.request = _injector.get(AppHttpRequestService);
    }

    get(): Observable<SessionLoginInformationDto> {
        const url = `${this.path}/api/services/app/Session/Get`;
        return this.request.get(url).pipe(mergeMap((data: any) => of(new SessionLoginInformationDto().fromJS(data))));
    }
}

export class SessionLoginInformationDto implements IFromJsonConvertable<SessionLoginInformationDto> {
    user: AppUserDto = new AppUserDto();
    application: AppServiceVersionDto = new AppServiceVersionDto();
    defaultCountry: AppCountryDto = new AppCountryDto();

    init(data: any): void {
        if (data) {
            this.user = data["user"] ? new AppUserDto().fromJS(data["user"]) : <any>undefined;
            this.application = data["application"] ? new AppServiceVersionDto().fromJS(data["application"]) : <any>undefined;
            this.defaultCountry = data["defaultCountry"] ? new AppCountryDto().fromJS(data["defaultCountry"]) : <any>undefined;
        }
    }

    fromJS(data: any): SessionLoginInformationDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }
}