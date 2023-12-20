import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'card-product-skeleton',
  templateUrl: 'card-product-skeleton.component.html',
  styleUrls: ['card-product-skeleton.component.scss']
})
export class CardProductSkeletonComponent implements OnInit {

  @Input() desktopMode: boolean = false;

  constructor() { }

  ngOnInit() { }

}
