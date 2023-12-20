import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { CoreModule } from '@geor360/core';
import { ComponentsModule } from '@geor360/ecommerce-components';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';
import { InboxChatBaseComponent } from './chat/base/chat-base.component';
import { InboxChatDesktopComponent } from './chat/desktop/chat-desktop.component';
import { InboxChatMobileComponent } from './chat/mobile/chat-mobile.component';
import { InboxChatTabletComponent } from './chat/tablet/chat-tablet.component';
import { InboxDashboardDesktopComponent } from './dashboard/desktop/dashboard-desktop.component';
import { InboxDashboardMobileComponent } from './dashboard/mobile/dashboard-mobile.component';
import { InboxDashboardTabletComponent } from './dashboard/tablet/dashboard-tablet.component';
import { InboxInputDirective } from './directives/input.directive';
import { InboxRoutingModule } from './inbox-routing.module';
import { InboxService } from './services/inbox.service';
import { InboxChannelItemComponent } from './shared/channel-item/channel-item.component';
import { ChatHistoryAudioComponent } from './shared/chat-history/chat-history-audio/chat-history-audio.component';
import { InboxChatHistoryItemComponent } from './shared/chat-history/chat-history-item/chat-history-item.component';
import { InboxChatHistoryResourceComponent } from './shared/chat-history/chat-history-resource/chat-history-resource.component';
import { InboxChatHistoryComponent } from './shared/chat-history/chat-history.component';
import { InboxChatInputResourcesComponent } from './shared/chat-input/chat-input-resources/chat-input-resource/chat-input-resource.component';
import { InboxChatInputResourceComponent } from './shared/chat-input/chat-input-resources/chat-input-resources.component';
import { InboxChatInputActionComponent } from './shared/chat-input/chat-input-toolbar/chat-input-action/chat-input-action.component';
import { InboxChatInputEmojiComponent } from './shared/chat-input/chat-input-toolbar/chat-input-emoji/chat-input-emoji.component';
import { InboxChatInputToolbarComponent } from './shared/chat-input/chat-input-toolbar/chat-input-toolbar.component';
import { InboxChatInputWaveComponent } from './shared/chat-input/chat-input-toolbar/chat-input-wave/chat-input-wave.component';
import { InboxChatInputComponent } from './shared/chat-input/chat-input.component';
import { InboxBlankComponent } from './shared/status/blank/blank.component';
import { InboxDisabledComponent } from './shared/status/disabled/disabled.component';
import { InboxLoadingComponent } from './shared/status/loading/loading.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    InboxRoutingModule,
    ComponentsModule,
    FormsModule,
    CoreModule,
    PickerComponent,
    EmojiComponent,
    PipesModule
  ],
  declarations: [
    InboxDashboardDesktopComponent,
    InboxDashboardTabletComponent,
    InboxDashboardMobileComponent,
    InboxLoadingComponent,
    InboxDisabledComponent,
    InboxChannelItemComponent,
    InboxChatBaseComponent,
    InboxChatDesktopComponent,
    InboxChatMobileComponent,
    InboxChatTabletComponent,
    InboxChatInputComponent,
    InboxChatInputResourcesComponent,
    InboxChatInputResourceComponent,
    InboxChatInputToolbarComponent,
    InboxChatInputActionComponent,
    InboxChatInputEmojiComponent,
    InboxChatInputWaveComponent,
    InboxChatHistoryComponent,
    InboxChatHistoryItemComponent,
    InboxChatHistoryResourceComponent,
    ChatHistoryAudioComponent,
    InboxBlankComponent,

    InboxInputDirective
  ],
  providers: [
    InboxService
  ]
})
export class InboxModule { }
