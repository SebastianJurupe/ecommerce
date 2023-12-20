import { NgModule } from '@angular/core';
import { ROUTES, RouterModule, Routes } from '@angular/router';
import { AppConfigurationService } from '@geor360/core';
import { InboxDashboardDesktopComponent } from './dashboard/desktop/dashboard-desktop.component';
import { InboxDisabledComponent } from './shared/status/disabled/disabled.component';
import { InboxBlankComponent } from './shared/status/blank/blank.component';
import { InboxDashboardMobileComponent } from './dashboard/mobile/dashboard-mobile.component';
import { InboxDashboardTabletComponent } from './dashboard/tablet/dashboard-tablet.component';
import { InboxChatMobileComponent } from './chat/mobile/chat-mobile.component';
import { InboxChatDesktopComponent } from './chat/desktop/chat-desktop.component';
import { InboxChatTabletComponent } from './chat/tablet/chat-tablet.component';

const mobileRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'chat', component: InboxDashboardMobileComponent },
      { path: 'chat/:channelId', component: InboxChatMobileComponent },
      { path: 'disabled', component: InboxDisabledComponent },
      { path: '**', redirectTo: 'chat', pathMatch: 'full' },
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
    ]
  }
];

const tabletRoutes: Routes = [
  {
    path: '',
    component: InboxDashboardTabletComponent,
    children: [
      { path: 'chat', component: InboxBlankComponent },
      { path: 'chat/:channelId', component: InboxChatTabletComponent },
      { path: 'disabled', component: InboxDisabledComponent },
      { path: '**', redirectTo: 'chat', pathMatch: 'full' },
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
    ]
  }
];

const desktopRoutes: Routes = [
  {
    path: '',
    component: InboxDashboardDesktopComponent,
    children: [
      { path: 'chat', component: InboxBlankComponent },
      { path: 'chat/:channelId', component: InboxChatDesktopComponent },
      { path: 'disabled', component: InboxDisabledComponent },
      { path: '**', redirectTo: 'chat', pathMatch: 'full' },
      { path: '', redirectTo: 'chat', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: (configuration: AppConfigurationService) => {

        const screen = configuration.screen();

        switch (screen) {
          case 'desktop': return desktopRoutes;
          case 'tablet': return tabletRoutes;
          case 'mobile': return mobileRoutes;
          default: return desktopRoutes;
        }
      },
      deps: [AppConfigurationService],
      multi: true
    }
  ]
})
export class InboxRoutingModule { }