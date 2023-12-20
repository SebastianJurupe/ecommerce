import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-desktop',
  templateUrl: 'register-desktop.component.html',
  styleUrls: ['register-desktop.component.scss'],
  host: { 'app.register-desktop': 'true' }
})
export class RegisterDesktopComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
