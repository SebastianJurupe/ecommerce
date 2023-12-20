import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'messages-desktop.component.html',
  styleUrls: ['messages-desktop.component.scss'],
  host: { 'app.messages-desktop': 'true' }
})
export class MessagesDesktopComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
