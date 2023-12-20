import { Component, ElementRef, Injector, Input, ViewChild } from '@angular/core';
import { ViewComponent } from '@geor360/core';
interface ICost {
  date: string,
}
@Component({
  templateUrl: 'calendar-base.component.html',
  styleUrls: ['calendar-base.component.scss'],
  host: { 'app.calendar-base': 'true' }
})
export class CalendarBaseComponent extends ViewComponent {

  @ViewChild('radioGroup') radioGroup: any;
  @ViewChild('dateContainer') dateContainer!: ElementRef;

  @Input() title: string = '';
  @Input() shipping_days: any
  @Input() dateSelected: any
  @Input() costDelivery: any

  isDragging = false;
  startPosition = 0;
  scrollLeft = 0;
  selectedDate: any;
  dates: ICost[] = [];
  currentDate: Date = new Date();
  checkbox1Selected = true;
  checkbox2Selected = false;
  monthYear: string = ''
  startDay: Date = new Date()

  WEEKDAYS: any = {
    0: 'dom',
    1: 'lun',
    2: 'mar',
    3: 'mie',
    4: 'jue',
    5: 'vie',
    6: 'sab'
  };

  options = [
    { time: "8:00am - 1:00pm", price: "30.00", value: "custom-checked" },
    { time: "2:00am - 5:00pm", price: "30.00", value: "custom" },
  ];


  constructor(_injector: Injector) {
    super(_injector);
  }

  selectRadio(value: any) {
    this.radioGroup.value = value;
  }

  ngOnInit() {
    this.formatedInitialDate(this.dateSelected)
    const getDaysInMonth = (year: number, month: number) => {
      const lastDay = new Date(year, month + 1, 0).getDate();
      const days = Array.from({ length: lastDay }, (_, i) => i + 1);
      return days;
    };
    const getDaysFromStartDate = (startDate: Date) => {
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const startIndex = startDate.getDate() - 1;
      return daysInMonth.slice(startIndex);
    };
    const currentDate = new Date();
    const daysToAdd = this.shipping_days;
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() + daysToAdd); // Fecha de inicio
    const daysFromStartDate = getDaysFromStartDate(startDate);
    this.startDay = startDate
    this.currentDate = startDate
    const startMonth = startDate.toLocaleString('es-ES', { month: 'short' });
    const startYear = startDate.getFullYear();
    daysFromStartDate.forEach(day => {
      const currentDay = new Date(startDate.getFullYear(), startDate.getMonth(), day);
      const daysWeek = currentDay.toLocaleString('es-ES', { weekday: 'short' });
      const monthName = currentDay.toLocaleString('es-ES', { month: 'short' });
      // Agregar al array 'dates'
      this.dates.push({
        date: `${daysWeek} ${currentDay.getDate()} ${monthName}`
      });
    });
    this.monthYear = `${startMonth} ${startYear}`;
  }


  formatedInitialDate(dateString: string) {
    const date = new Date(dateString);
    const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysWeek = currentDay.toLocaleString('es-ES', { weekday: 'short' });
    const monthName = currentDay.toLocaleString('es-ES', { month: 'short' })
    const dateSelected = `${daysWeek} ${currentDay.getDate()} ${monthName}`
    this.onDateSelected(dateSelected)
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.updateCalendar();
  }

  lastMonth() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + this.shipping_days); // Fecha de inicio
    const newDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    if (newDate.getFullYear() > startDate.getFullYear() ||
      (newDate.getFullYear() === startDate.getFullYear() && newDate.getMonth() >= startDate.getMonth())) {
      this.currentDate = newDate;
      this.updateCalendar();
    }
  }

  updateCalendar() {
    this.dates = [];
    const getDaysMonth = (year: any, month: any) => {
      let newDate = new Date(year, month - 1, 1);
      let days = [];
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() + this.shipping_days); // Fecha de inicio
      while (newDate.getMonth() === month - 1) {
        if (newDate >= startDate || newDate.toDateString() === startDate.toDateString()) {
          days.push(new Date(newDate));
        }
        newDate.setDate(newDate.getDate() + 1);
      }
      return days;
    };
    const getMonthAbbreviation = (month: number) => {
      const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      return monthNames[month];
    };
    const daysMonth = getDaysMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    daysMonth.forEach(day => {
      const currentDay = new Date(day);
      const daysWeek = this.WEEKDAYS[currentDay.getDay()];
      const monthAbbreviation = getMonthAbbreviation(currentDay.getMonth());
      this.dates.push({
        date: `${daysWeek} ${currentDay.getDate()} ${monthAbbreviation}`
      });
    });
  }

  onDateSelected(date: string) {
    if (this.selectedDate === date) {
      this.selectedDate = null;
    } else {
      this.selectedDate = date;
    }
  }

  parseDateString(inputDate: string): Date {
    const monthMap: { [key: string]: number } = {
      'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
      'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
    };
    const dateParts = inputDate.split(' ');

    if (dateParts.length !== 3) {
      throw new Error('Formato de fecha no válido.');
    }
    const month = monthMap[dateParts[2].toLowerCase()];
    const day = parseInt(dateParts[1], 10);
    if (isNaN(month) || isNaN(day)) {
      throw new Error('Fecha no válida.');
    }
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, month, day);
  }

  save() {
    let state: boolean
    if (this.radioGroup.value == 'custom') {
      state = true
    } else {
      state = false
    }
    let dateSelected = {
      from: this.parseDateString(this.selectedDate),
      to: this.parseDateString(this.selectedDate),
      state: state
    }
    this.dialog.dismiss(dateSelected);
  }

  close() {
    this.dialog.dismiss();
  }

}