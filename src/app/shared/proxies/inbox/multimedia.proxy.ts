import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AppHttpRequestService } from '@geor360/core';
import { Observable } from 'rxjs';

@Injectable()
export class InboxMultimediaServiceProxy {
    private request: AppHttpRequestService;

    get path(): string {
        return this.request.api.inbox.path;
    }

    constructor(_injector: Injector) {
        this.request = _injector.get(AppHttpRequestService);
    }

    download(method: 'GET' | 'POST', url: string): Observable<Blob> {
        const  options: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };

        return this.request.download(method, url, options);
    }
    
    uploads(files: globalThis.File[]): Observable<HttpEvent<any>> {
        const form: FormData = new FormData();

        for (const file of files) {
            form.append('images', file, file.name);
        }

        const url = `${this.path}/api/MultimediaResource/UploadFiles`;
  
        const request = new HttpRequest('POST', url, form, {
            reportProgress: true,
            responseType: 'json',
            headers: new HttpHeaders({})
        });

        return this.request.upload(request);
    }
}