import { ModuleWithProviders, NgModule } from '@angular/core';
import { ToolbarService } from './toolbar.service';
import { RenderService } from './render.service';

@NgModule({})
export class ServiceModule {

  static forRoot(): ModuleWithProviders<ServiceModule> {

    return {
      ngModule: ServiceModule,
      providers: [
        ToolbarService,
        RenderService
      ]
    };
  }

}
