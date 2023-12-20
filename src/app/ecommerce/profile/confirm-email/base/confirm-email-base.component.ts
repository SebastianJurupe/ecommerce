import { Component, Injector } from '@angular/core';
import { ApiException, AppTabService, ViewComponent } from '@geor360/core';
import { AccountServiceProxy } from '@shared/proxies/profile/account.proxie';
import { CodeConfirmationService } from '../../services/code-confirmation.service';

@Component({
  selector: 'app-confirm-email-base',
  templateUrl: 'confirm-email-base.component.html',
  styleUrls: ['confirm-email-base.component.scss'],
  host: { 'app.confirm-email-base': 'true' }
})
export class ConfirmEmailBaseComponent extends ViewComponent {

  private _accountServiceProxy: AccountServiceProxy;
  private _codeConfirmationService: CodeConfirmationService;

  email: string = '';
  isLoading: boolean = false;
  toolbar: AppTabService;
  type: 'email_reset' = 'email_reset';

  constructor(_injector: Injector) {
    super(_injector);
    this._accountServiceProxy = _injector.get(AccountServiceProxy);
    this._codeConfirmationService = _injector.get(CodeConfirmationService);
    this.toolbar = _injector.get(AppTabService);
  }

  onResetPassword(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this.isLoading = true;
      this._accountServiceProxy.resetPassword(this.email)
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.isLoading = false;
              this._codeConfirmationService.setResetPasswordData({ email: this.email });
              resolve(true);
            }
          },
          error: (err: ApiException) => {
            this.isLoading = false;
            reject(false);

            this.message.exception(err);
          }
        });
    });

  }

  disableButton() {
    return (
      this.email === '' ||
      this.email === null ||
      this.email === undefined ||
      !this.email.includes('@')
      || this.isLoading
    );
  }
}
