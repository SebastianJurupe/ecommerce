import { mergeMap } from 'rxjs/operators';
import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService } from "@geor360/core";
import { Observable, of } from "rxjs";
import { IFromJsonConvertable, PagedResultDto } from "@geor360/core";

@Injectable()
export class PublicServiceProxy {
    private request: AppHttpRequestService;

    get path(): string {
        return this.request.api.store.path;
    }

    constructor(_injector: Injector) {
        this.request = _injector.get(AppHttpRequestService);
    }

    getAllCountries(filter?: string, sorting?: string, maxResultCount?: number | undefined, skipCount?: number): Observable<PagedResultDto<PublicCountryDto>> {
        let url = `${this.path}/api/services/app/Public/GetCountries?`;

        if (filter !== undefined && filter !== null)
            url += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (sorting !== undefined && sorting !== null)
            url += "Sorting=" + encodeURIComponent("" + sorting) + "&";
        if (maxResultCount !== undefined && maxResultCount !== null)
            url += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&";
        if (skipCount !== undefined && skipCount !== null)
            url += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";

        url = url.replace(/[?&]$/, "");

        return this.request.get(url).pipe(mergeMap((data: any) => of(new PagedResultDto<PublicCountryDto>().fromJS(data, PublicCountryDto))));
    }
}

export class PublicCountryDto implements IFromJsonConvertable<PublicCountryDto> {
    id: number = 0;
    name: string = '';
    flag: string = '';
    mask: string = '';
    default: boolean = false;
    code: string = '';
    taxIdentifier: string = '';
    constructor(data?: any) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data: any): void {
        if (data) {
            this.name = data["name"];
            this.flag = data["flag"];
            this.mask = data["mask"];
            this.default = data["default"];
            this.code = data["code"];
            this.id = data["id"];
            this.taxIdentifier = data["taxIdentifier"];
        }
    }

    fromJS(data: any): PublicCountryDto {
        data = typeof data === 'object' ? data : {};
        this.init(data);
        return this;
    }
}
