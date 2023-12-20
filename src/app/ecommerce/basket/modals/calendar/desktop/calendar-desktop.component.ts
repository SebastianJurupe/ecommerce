import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { CalendarBaseComponent } from '../base/calendar-base.component';

@Component({
  templateUrl: 'calendar-desktop.component.html',
  styleUrls: ['calendar-desktop.component.scss'],
  host: { 'app.calendar-desktop': 'true' }
})
export class CalendarDesktopComponent extends CalendarBaseComponent implements OnInit {

  constructor(_injector: Injector) {
    super(_injector);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.isDragging) {
      const delta = e.clientX - this.startPosition;
      this.dateContainer.nativeElement.scrollLeft = this.scrollLeft - delta;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  onDateContainerMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.startPosition = e.clientX;
    this.scrollLeft = this.dateContainer.nativeElement.scrollLeft;
  }

  onDateContainerMouseLeave() {
    this.isDragging = false;
  }


}
