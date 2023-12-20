import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AppThemeService } from '@geor360/core';
import { RenderService } from '@shared/services/render.service';
import { Subscription } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
@Component({
  selector: 'app-root',
  template: `
    <ion-app id="app-root" class="safe-area-bottom safe-area-top" [style.minHeight.px]="deviceHeight">
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class RootComponent implements OnInit, OnDestroy {

  theme: AppThemeService;

  private showed: boolean = false;
  private render: RenderService;
  private subscription: Subscription;

  get deviceHeight(): number | null {
    return this.showed ? this.render.deviceHeight : null;
  };

  constructor(injector: Injector) {
    this.render = injector.get(RenderService);
    this.theme = injector.get(AppThemeService);

    this.changeStatusBarColor();
    this.subscription = this.render.onChange.subscribe({
      next: (newStatus) => {
        this.showed = (newStatus == 'show');
      }
    });
  }

  changeStatusBarColor() {
    const actualMode = this.theme.mode === 'system' ? this.getSystemTheme() : this.theme.mode;
    const statusBarColor = actualMode === 'dark' ? '#171717' : '#FFFFFF';
    // Configurar StatusBar para Android y ios
    StatusBar.setBackgroundColor({ color: statusBarColor });
    StatusBar.setStyle({ style: this.theme.mode === 'dark' ? Style.Dark : Style.Light });
  }

  getSystemTheme(): 'dark' | 'light' {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }


  ngOnInit(): void {
    this.render.init();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}