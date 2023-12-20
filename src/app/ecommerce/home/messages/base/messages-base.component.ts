import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'messages-base.component.html',
  styleUrls: ['messages-base.component.scss'],
  host: { 'app.messages-base': 'true' }
})
export class MessagesBaseComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
