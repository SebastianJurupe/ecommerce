import { Component, Injector, Input } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { ProfileGetPersonalInformationOutputDataDto } from '@shared/proxies/profile/profile.proxies';
import { PersonalInformationService } from '../../../services/personal-information.service';

@Component({
  templateUrl: 'name-mobile.component.html',
  styleUrls: ['name-mobile.component.scss'],
  host: { 'app.name-mobile': 'true' }
})
export class NameMobileComponent extends ViewComponent {

  private _personalInformationService: PersonalInformationService;

  @Input() personalInformation!: ProfileGetPersonalInformationOutputDataDto;

  isLoading: boolean = false;
  name: string = ''

  constructor(_injector: Injector) {
    super(_injector);
    this._personalInformationService = _injector.get(PersonalInformationService);
  }

  ngOnInit() {
    this.name = this.personalInformation.name
  }
  async submit() {
    this.isLoading = true;

    this.personalInformation.name = this.name

    try {
      const updated = await this._personalInformationService.updatePersonalInformation(this.personalInformation, true);

      if (updated) {
        this.isLoading = false;
        this.dialog.dismiss(true);
      }
    } catch (error) {
      this.isLoading = false;
      this.dialog.dismiss(false);
    }
  }

  disableButton() {
    return this.personalInformation.name === '' ||
      this.isLoading;
  }
}
