import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textSlice'
})
export class TextSlicePipe implements PipeTransform {

  transform(value: string, limit: number): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }

}
