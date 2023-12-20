import { Injectable, Injector } from '@angular/core';
import { AppThemeService, ViewComponent } from '@geor360/core';
import { PopoverController } from '@ionic/angular';
import { AnimationModalService } from './animation-modal.service';
import { AuthTokenService } from './auth-token.service';
import { MenuComponent } from 'src/app/ecommerce/home/modals/menu/menu.component';
import { LoginTabletComponent } from 'src/app/ecommerce/profile/login';
import { ProfileComponent } from 'src/app/ecommerce/profile/modals/profile/profile.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HomeDesktopComponent as HomeDesktopComponentPopover } from 'src/app/ecommerce/categories/home';

@Injectable({
	providedIn: 'root'
})
export class HeaderDesktopService extends ViewComponent {

	private _animationModalService: AnimationModalService;
	private _appThemeService: AppThemeService;
	private _authTokenService: AuthTokenService;
	private _popoverController: PopoverController;
	private _updateLanguageFunction = new Subject<void>();
	private _valueInputSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

	functionLanguage$ = this._updateLanguageFunction.asObservable();

	constructor(_injector: Injector) {
		super(_injector);
		this._animationModalService = _injector.get(AnimationModalService);
		this._appThemeService = _injector.get(AppThemeService);
		this._authTokenService = _injector.get(AuthTokenService);
		this._popoverController = _injector.get(PopoverController);
	}

	emitFunctionLanguageEvent() {
		this._updateLanguageFunction.next();
	}

	updateValueInput(newValue: string): void {
		this._valueInputSubject.next(newValue);
	}

	get logoSrc(): string {
		return this._appThemeService.theme === 'dark'
			? '/assets/config/resources/logo-horizontal.svg'
			: '/assets/config/resources/logo-horizontal.svg';
	}
	getText(): Observable<string> {
		return this._valueInputSubject;
	}

	viewMenu() {
		this._authTokenService.isAuthenticated()
			.subscribe(async (isAuthenticated) => {

				if (!isAuthenticated) {
					this.dialog.showWithData<'cancel' | undefined>({
						component: MenuComponent,
						enterAnimation: this._animationModalService.outAnimation,
						leaveAnimation: this._animationModalService.enterAnimation,
						cssClass: ['modal-custom', 'modal-custom--in-center-medium-1']
					});
				} else {
					if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) {

					} else {
						this.dialog.showWithData<'cancel' | undefined>({
							component: MenuComponent,
							enterAnimation: this._animationModalService.outAnimation,
							leaveAnimation: this._animationModalService.enterAnimation,
							cssClass: ['modal-custom', 'modal-custom--in-center-medium-1']
						});
					}
				}
			});

	}

	async profilePopover(event: Event) {
		this._authTokenService.isAuthenticated()
			.subscribe(async (isAuthenticated) => {

				if (!isAuthenticated) {
					this.dialog
						.showWithData<'confirm' | undefined>({
							component: LoginTabletComponent,
							backdropDismiss: false,
							enterAnimation: this._animationModalService.openDesktopModal,
							leaveAnimation: this._animationModalService.closeDesktopModal,
							cssClass: ['modal-custom', 'modal-custom--in-center-medium']
						});
				} else {
					if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) {

					} else {
						const popover = await this._popoverController.create({
							component: ProfileComponent,
							event: event,
							cssClass: 'popover-profile-desktop',
							alignment: 'end',
							arrow: false,
							dismissOnSelect: false,
							triggerAction: 'context-menu',
						});

						await popover.present();
					}

				}
			});
	}

	goToShoppingCart() {
		this._authTokenService.isAuthenticated()
			.subscribe(async (isAuthenticated) => {
				if (!isAuthenticated) {
					this.dialog
						.showWithData<'confirm' | undefined>({
							component: LoginTabletComponent,
							backdropDismiss: false,
							enterAnimation: this._animationModalService.openDesktopModal,
							leaveAnimation: this._animationModalService.closeDesktopModal,
							cssClass: ['modal-custom', 'modal-custom--in-center-medium']
						});
				} else {
					if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) {
					} else {
						this.navigation.forwardNoAnimation('/app/ecommerce/basket/home');
					}
				}
			});
	}

	goToHome() {
		this._authTokenService.isAuthenticated()
			.subscribe(async (isAuthenticated) => {

				if (!isAuthenticated) {
					this.navigation.backNoAnimation('/app/ecommerce/home/home');
				} else {
					if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) {

					} else {
						this.navigation.backNoAnimation('/app/ecommerce/home/home');
					}
				}
			});


	}

	goToInbox() {
		// this.navigation.backNoAnimation('/app/ecommerce/inbox');
	}

	async inputClicked(event: PointerEvent | Event) {
		this._authTokenService.isAuthenticated()
			.subscribe(async (isAuthenticated) => {

				if (!isAuthenticated) {
					const popover = await this._popoverController.create({
						component: HomeDesktopComponentPopover,
						event: event,
						alignment: 'center',
						size: 'cover',
						arrow: false,
						dismissOnSelect: true,
						cssClass: 'popover-search-desktop',
						componentProps: {
							textOld: this.getText()
						}
					});

					await popover.present();
				} else {
					if (!this.session.user.isEmailConfirmed || !this.session.user.isPhoneNumberConfirmed) {
					} else {
						const popover = await this._popoverController.create({
							component: HomeDesktopComponentPopover,
							event: event,
							alignment: 'center',
							size: 'cover',
							arrow: false,
							dismissOnSelect: true,
							cssClass: 'popover-search-desktop',
						});

						await popover.present();
					}
				}
			});
	}
}