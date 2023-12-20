import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs)
@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (localStorage.getItem("language") === "es_ES") {
      const datePipe = new DatePipe('es');
      return datePipe.transform(value, 'dd LLL yyyy');
    } else {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(value, 'dd LLL yyyy');
    }

  }

}
