import { Injectable, Injector } from '@angular/core';
import { ProfileGetPersonalInformationOutputDataDto } from '@shared/proxies/profile/profile.proxies';
import { AppUserDto, ViewComponent } from '@geor360/core';

@Injectable({
    providedIn: 'root'
})
export class ValidateAuthService extends ViewComponent {
    personalInformation: ProfileGetPersonalInformationOutputDataDto = new ProfileGetPersonalInformationOutputDataDto();


    constructor(_injector: Injector) {
        super(_injector);
    }

    handleMobileVerification(personalInformation: AppUserDto) {
        const { isEmailConfirmed, isPhoneNumberConfirmed } = personalInformation;

        if (!isPhoneNumberConfirmed || !isEmailConfirmed) {
            if (this.configuration.screen() == 'mobile') {
                this.navigation.forwardNoAnimation('/app/ecommerce/profile/personal-information');
            } else {
                this.navigation.forwardNoAnimation('/app/ecommerce/profile/setting');
            }
        }

        if (!isEmailConfirmed) {
            if (this.configuration.screen() == 'mobile') {
                this.navigation.forwardNoAnimation('/app/ecommerce/profile/personal-information');
            } else {
                this.navigation.forwardNoAnimation('/app/ecommerce/profile/setting');
            }
        }
    }


}