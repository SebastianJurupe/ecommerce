import { APP_INITIALIZER, Injector, NgModule, } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, Platform } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DOCUMENT, PlatformLocation } from '@angular/common';
import { CoreModule, CoreTranslations, IAppCoreConfig, AppSessionService, AppConfigurationService, AppThemeService, XmlHttpRequestHelper, AppCoreConsts, AppPreferenceService, RefreshTokenService, IApiConfig, IMultitenancyConfiguration } from '@geor360/core';
import { RootRoutingModule } from './root.routing.module';
import { RootComponent } from './root.component';
import { ThemeDetection } from '@awesome-cordova-plugins/theme-detection/ngx';
import { AppConsts } from './shared/app.consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { environment } from './environments/environment';
import { finalize } from 'rxjs';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { ProxiesModule } from './app/shared/proxies/proxies.module';
import { SessionLoginInformationDto, SessionServiceProxy } from './app/shared/proxies/profile/session.proxie';
import { EcommerceTranslations } from './shared/localization/ecommerce.localizations';
import { register } from 'swiper/element/bundle';
import { ValidateAuthService } from './app/ecommerce/profile/services/validate-auth.service';
import { ServiceModule } from '@shared/services/service.module';
import { ReactiveFormsModule } from '@angular/forms';

register();

function appInitializerFactory(injector: Injector) {
    return () => {
        return new Promise<boolean>((resolve) => {
            const platform: Platform = injector.get(Platform);
            const validateAuthService: ValidateAuthService = injector.get(ValidateAuthService);
            const document: Document = injector.get(DOCUMENT);
            const platformLocation: PlatformLocation = injector.get(PlatformLocation);
            const configurationService: AppConfigurationService = injector.get(AppConfigurationService);

            AppConsts.baseHref = getBaseHref(platformLocation);
            const appRootUrl = getDocumentOrigin() + AppConsts.baseHref;

            platform.ready().then(() => {
                const themeService: AppThemeService = injector.get(AppThemeService);
                themeService.init().then(() => {

                    getApplicationConfig(appRootUrl, (api, multitenancy) => {

                        setupConfig(document, api, multitenancy, configurationService,);

                        const appSession: AppSessionService = injector.get(AppSessionService);
                        const sessionProxie: SessionServiceProxy = injector.get(SessionServiceProxy);


                        getSession(sessionProxie, platform, themeService, (session) => {
                            if (session.user) {
                                appSession.save(session.user, session.application, session.defaultCountry);
                                validateAuthService.handleMobileVerification(session.user);
                                resolve(true);
                            } else {
                                const refreshTokenService: RefreshTokenService = injector.get(RefreshTokenService);
                                const preferenceService: AppPreferenceService = injector.get(AppPreferenceService);

                                tryAuthWithRefreshToken(refreshTokenService, preferenceService).then((status) => {
                                    if (status) {
                                        getSession(sessionProxie, platform, themeService, (session) => {
                                            appSession.save(session.user, session.application, session.defaultCountry);
                                            resolve(true);
                                        }, () => resolve(true));
                                    } else {
                                        clearTokens(preferenceService).then(() => resolve(true));
                                    }
                                });
                            }
                        }, () => resolve(true));
                    });
                });
            });
        });
    };
}

const getDocumentOrigin = () => {
    if (!document.location.origin)
        return `${document.location.protocol}//${document.location.hostname}${(document.location.port ? ':' + document.location.port : '')}`;

    return document.location.origin;
};

const getSession = (sessionProxie: SessionServiceProxy, platform: Platform, themeService: AppThemeService, success: (session: SessionLoginInformationDto) => void, error: () => void) => {
    sessionProxie
        .get()
        .pipe(finalize(() => {
            if (platform.is('capacitor')) {
                setTimeout(() => {
                    StatusBar.setStyle({
                        style: themeService.theme == 'dark' ? Style.Dark : Style.Light
                    });
                }, 200);
            }
        })).subscribe({
            next: (response) => success(response),
            error: () => error()
        });
};

const tryAuthWithRefreshToken = (refreshTokenService: RefreshTokenService, preferenceService: AppPreferenceService): Promise<boolean> => new Promise<boolean>(async (resolve) => {
    getRefreshToken(preferenceService, (refreshToken) => {
        if (refreshToken) {
            refreshTokenService.tryAuthWithRefreshToken().subscribe({
                next: (status) => {
                    if (status) {
                        resolve(status);
                    } else {
                        clearTokens(preferenceService).then(() => resolve(status));
                    }
                }
            });
        } else {
            resolve(false);
        }
    });
});

const getRefreshToken = (preferenceService: AppPreferenceService, callback: (refreshToken?: string) => void) => {
    preferenceService.get(AppCoreConsts.authorization.refreshAuthTokenName).subscribe({
        next: (token) => callback(token),
        error: () => callback()
    });
};

const clearTokens = (preferenceService: AppPreferenceService): Promise<void> => new Promise<void>(async (resolve) => {
    try {
        await preferenceService.del(AppCoreConsts.authorization.authTokenName);
    } catch (error) {

    }
    try {
        await preferenceService.del(AppCoreConsts.authorization.refreshAuthTokenName);
    } catch (error) {

    }
    try {
        await preferenceService.del(AppCoreConsts.authorization.encrptedAuthTokenName);
    } catch (error) {

    }

    resolve();
});


const getBaseHref = (platformLocation: PlatformLocation): string => {
    const baseUrl = platformLocation.getBaseHrefFromDOM();
    return baseUrl ? baseUrl : '/';
};

const setupConfig = (doc: Document, api: IApiConfig, multitenancy: IMultitenancyConfiguration, configuration: AppConfigurationService) => {

    const win: Window | undefined = doc.defaultView as any;

    if (win && typeof (window as any) !== 'undefined') {
        const config: IAppCoreConfig = {
            translations: {
                core: CoreTranslations,
                ecommerce: EcommerceTranslations
            },
            google: {
                webClientId: AppConsts.google.webClientId,
                maps: {
                    maxZoom: 16,
                    minZoom: 5,
                    defaultZoom: 16
                }
            },
            multitenancy: multitenancy,
            api: api,
            firebase: undefined,
            session: {
                clearSession: true,
                internalRedirect: {
                    enabled: false,
                    path: "/app/ecommerce/home/home",
                    direction: 'back'
                }
            }
        };

        configuration.set(config);
    }
};

const getApplicationConfig = (appRootUrl: string, callback: (api: IApiConfig, multitenancy: IMultitenancyConfiguration) => void) => {
    const url: string = `${appRootUrl}assets/${environment.appConfig}`;
    const method: string = 'GET';

    XmlHttpRequestHelper.ajax(method, url, [], null, (_success: boolean, response: any) => {
        AppConsts.baseUrl = response.appBaseUrl;
        callback(response.services, response.multitenancy);
    });
};

@NgModule({
    declarations: [
        RootComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        RootRoutingModule,
        NgxOtpInputModule,
        BrowserAnimationsModule,
        CoreModule.forRoot(),
        ServiceModule.forRoot(),
        ProxiesModule.forRoot(),
        IonicModule.forRoot({
            mode: 'ios',
            swipeBackEnabled: false
        }),
        HttpClientModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [
                Injector
            ],
            multi: true,
        },
        //PLUGINS
        ThemeDetection,
        AndroidPermissions,
        OpenNativeSettings,
        Diagnostic,
    ],
    bootstrap: [
        RootComponent
    ]
})
export class RootModule { }