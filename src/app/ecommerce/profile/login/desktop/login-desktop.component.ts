import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desktop',
  templateUrl: 'login-desktop.component.html',
  styleUrls: ['login-desktop.component.scss'],
  host: { 'app.login-desktop': 'true' }
})
export class LoginDesktopComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
