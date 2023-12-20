import { Component, Injector } from '@angular/core';
import { AppThemeService, ViewComponent } from '@geor360/core';

@Component({
  templateUrl: 'change-mode-base.component.html',
  styleUrls: ['change-mode-base.component.scss'],
  host: { 'app.change-mode-base': 'true' }
})
export class ChangeModeBaseComponent extends ViewComponent {

  theme: AppThemeService;
  mode: 'system' | 'dark' | 'light';

  constructor(_injector: Injector) {
    super(_injector);
    this.theme = _injector.get(AppThemeService);
    this.mode = this.theme.mode;
  }

  setTheme(theme: 'system' | 'dark' | 'light') {
    this.mode = theme;
    this.theme.changeMode(theme);
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/setting');
  }
}
