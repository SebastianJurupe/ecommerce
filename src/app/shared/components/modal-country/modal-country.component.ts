import { Component, Injector, Input, OnInit, Renderer2 } from "@angular/core";
import { AppConfigurationService, ViewComponent } from "@geor360/core";
import { ViewWillEnter, ViewWillLeave } from "@ionic/angular";
import { Observable, map, of } from "rxjs";
import { PublicGetCountriesOutputDataDto, PublicServiceProxy } from "../../proxies/public/public.proxie";


@Component({
  templateUrl: 'modal-country.component.html',
  styleUrls: ['modal-country.component.scss'],
  host: { 'app.modal-country': 'true' }
})
export class ModalCountryComponent extends ViewComponent implements OnInit, ViewWillEnter, ViewWillLeave {

  private _publicServiceProxy: PublicServiceProxy;
  private _configuration: AppConfigurationService;
  private _renderer2: Renderer2;
  device: string;

  @Input() title: string = '';
  @Input() countryCode: string = '';
  @Input() countryId: string = 'PE';
  @Input() showTax: boolean = false;
  @Input() showCountryCode: boolean = false;

  filterValue: string = '';
  countries$: Observable<PublicGetCountriesOutputDataDto[]> = of([]);
  notFound: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
    this._publicServiceProxy = _injector.get(PublicServiceProxy);
    this._renderer2 = _injector.get(Renderer2);
    this._configuration = _injector.get(AppConfigurationService);
    this.device = this._configuration.screen();
  }

  ngOnInit() {
    this.subscribeToCountries();
  }

  ionViewWillEnter() {
    const appRoot = document.getElementById('app-root');
    this._renderer2.removeClass(appRoot, 'safe-area-bottom');
  }

  subscribeToCountries(filterValue?: string) {
    return this.countries$ = this._publicServiceProxy.getCountries(undefined, filterValue)
      .pipe(map(res => {
        if (res.data.length === 0) {
          this.notFound = true;
        } else {
          this.notFound = false;
          return res.data;
        }
      }));
  }

  search(filterValue: string) {
    this.subscribeToCountries(filterValue);
  }

  clearInput() {
    this.search('');
  }

  back() {
    this.dialog.dismiss('cancel');
  }

  select(country: PublicGetCountriesOutputDataDto) {
    this.dialog.dismiss(country);
  }

  ionViewWillLeave() {
    const appRoot = document.getElementById('app-root');
    this._renderer2.addClass(appRoot, 'safe-area-bottom');
  }

  close() {
    this.dialog.dismiss('cancel');
  }
}
