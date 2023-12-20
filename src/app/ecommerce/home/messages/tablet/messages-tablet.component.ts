import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'messages-tablet.component.html',
  styleUrls: ['messages-tablet.component.scss'],
  host: { 'app.messages-tablet': 'true' }
})
export class MessagesTabletComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
