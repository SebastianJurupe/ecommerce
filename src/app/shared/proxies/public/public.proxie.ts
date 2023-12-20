import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from "rxjs";

@Injectable()
export class PublicServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  getCountries(id?: string, description?: string): Observable<any> {
    let url = `${this.path}/api/services/app/Public/GetCountries`;

    if (id !== undefined && id !== null)
      url += "?id=" + encodeURIComponent("" + id);
    if (description !== undefined && description !== null)
      url += "&description=" + encodeURIComponent("" + description);

    url = url.replace(/[?&]$/, "");

    return this.request.get(url);
  }

  getAllLegalInformation() {
    const url = `${this.path}/api/services/app/Public/GetAllLegalInformation`;

    return this.request.get(url);
  }

  getLegalInformation(LegalInformationCode: string) {
    let url = `${this.path}/api/services/app/Public/GetLegalInformation?`;

    if (LegalInformationCode !== undefined && LegalInformationCode !== null) {
      url += "LegalInformationCode=" + encodeURIComponent("" + LegalInformationCode);
    }

    url.replace(/[?&]$/, "");

    return this.request.get(url);
  }
}

export class PublicGetCountriesOutputDto implements IFromJsonConvertable<PublicGetCountriesOutputDto>{
  data: PublicGetCountriesOutputDataDto[] = [];
  success: boolean = false;
  message: string = '';

  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.data = data['data'];
      this.success = data['success'];
      this.message = data['message'];
    }
  }

  fromJS(data: any): PublicGetCountriesOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class PublicGetCountriesOutputDataDto {
  id: string = '';
  description: string = '';
  default: boolean = false;
  code: string = '';
  mask: string = '';
  flag: string = '';
  national_division: string[] = [];
}