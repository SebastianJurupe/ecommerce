import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateRange'
})
export class FormatDateRangePipe implements PipeTransform {
  transform(arrivesFrom: string, arrivesTo: string): string {
    const fromDate = new Date(arrivesFrom);
    const toDate = new Date(arrivesTo);

    const fromDateString = this.formatDate(fromDate);
    const fromTimeString = this.formatTime(fromDate);
    const toTimeString = this.formatTime(toDate);

    return `${fromDateString} de ${fromTimeString} a ${toTimeString}`;
  }

  private formatDate(date: Date): string {
    const options = { day: 'numeric', month: 'long' } as Intl.DateTimeFormatOptions;
    return date.toLocaleDateString('es-ES', options);
  }

  private formatTime(date: Date): string {
    const hour = this.formatTwoDigits12HourClock(date.getHours());
    const minute = this.formatTwoDigits(date.getMinutes());
    const period = this.getPeriod(date.getHours());

    return `${hour}:${minute}${period}`;
  }

  private formatTwoDigits(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private formatTwoDigits12HourClock(value: number): string {
    if (value === 0) {
      return '12';
    } else if (value > 12) {
      return this.formatTwoDigits(value - 12);
    } else {
      return this.formatTwoDigits(value);
    }
  }

  private getPeriod(hour: number): string {
    return hour < 12 ? 'am' : 'pm';
  }
}
