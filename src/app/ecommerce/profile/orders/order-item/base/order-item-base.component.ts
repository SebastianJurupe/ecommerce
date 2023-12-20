import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { Observable, interval, map } from 'rxjs';
import { OrderStatus } from "./../../../order-detail/base/order-detail-base.component";

@Component({
  templateUrl: 'order-item-base.component.html',
  styleUrls: ['order-item-base.component.scss'],
  host: { 'app.order-item-base': 'true' }
})
export class OrderItemBaseComponent extends ViewComponent implements OnInit {

  @Input() order: any;

  @Output() click: EventEmitter<void> = new EventEmitter<void>();

  counter$!: Observable<string>;
  timeLeftExpired: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
  }

  get status(): string {
    switch (this.order.status as OrderStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return 'pending-payment';

      case OrderStatus.IN_PREPARATION:
        return 'preparation';

      case OrderStatus.IN_WAY:
        return 'on-the-way';

      case OrderStatus.DELIVERED:
        return 'delivered';

      case OrderStatus.CANCELLED:
        return 'canceled';

      default:
        return '';
    }
  }

  get createdAt(): string | null {
    const locale = this.localization.currentLanguage === 'es_ES' ? 'es-ES' : 'en-US';
    const datePipe = new DatePipe(locale);

    return datePipe.transform(this.order.created_at, 'dd MMM yyyy');
  }

  ngOnInit() {
    this.calculateLeftTime();
  }

  orderDetails() {
    this.click.emit();
  }

  calculateLeftTime() {
    if (this.order.status !== 'PENDIENTE DE PAGO') return;

    const initialDate = new Date(this.order.created_at);
    const endDate = new Date(initialDate.getTime() + 24 * 60 * 60 * 1000);

    if (new Date() > endDate) { this.timeLeftExpired = true; return; }

    this.counter$ = interval(1000)
      .pipe(
        map(() => {
          const now = new Date();
          const difference = endDate.getTime() - now.getTime();

          const hours = Math.floor(difference / (1000 * 60 * 60));

          const minutes = Math.floor(
            (difference / (1000 * 60 * 60) - hours) * 60
          );

          const seconds = Math.floor(
            ((difference / (1000 * 60 * 60) - hours) * 60 - minutes) * 60
          );
          return `${hours}:${minutes}:${seconds}`;
        })
      );

    return 'Tiempo expirado';
  }
}