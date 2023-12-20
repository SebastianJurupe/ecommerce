import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(data: any[], searchText: any, key: string): any[] {
    if (!data) { return []; }

    if (!searchText) { return data; }

    searchText = searchText.toLowerCase().trim();

    return data.filter(item => item[key].toLowerCase().trim().includes(searchText));
  }

}
