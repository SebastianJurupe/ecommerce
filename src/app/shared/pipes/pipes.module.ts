import { NgModule } from '@angular/core';
import { TextSlicePipe } from './text-slice.pipe';
import { FilterPipe } from './filter.pipe';
import { DateFormatPipe } from './date-format.pipe';


@NgModule({
  imports: [],
  declarations: [
    TextSlicePipe,
    FilterPipe,
    DateFormatPipe,

  ],
  exports: [
    TextSlicePipe,
    FilterPipe,
    DateFormatPipe,
  
  ]
})
export class PipesModule { }
