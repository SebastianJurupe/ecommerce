import { Component, Injector } from '@angular/core';
import { AppThemeService, ViewComponent } from '@geor360/core';
import { StatusBar, Style } from '@capacitor/status-bar';
@Component({
  templateUrl: 'change-mode-mobile.component.html',
  styleUrls: ['change-mode-mobile.component.scss'],
  host: { 'app.change-mode-mobile': 'true' }
})
export class ChangeModeMobileComponent extends ViewComponent {

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
    this.changeStatusBarColor();
  }

  changeStatusBarColor() {
    const actualMode = this.theme.mode === 'system' ? this.getSystemTheme() : this.theme.mode;
    const statusBarColor = actualMode === 'dark' ? '#171717' : '#FFFFFF';
    StatusBar.setBackgroundColor({ color: statusBarColor });
    StatusBar.setStyle({ style: actualMode === 'dark' ? Style.Dark : Style.Light });
  }

  getSystemTheme(): 'dark' | 'light' {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  onBackButtonPressed() {
    this.navigation.back('/app/ecommerce/profile/setting');
  }
}
