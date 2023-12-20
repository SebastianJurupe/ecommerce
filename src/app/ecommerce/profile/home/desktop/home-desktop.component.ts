import { Component } from '@angular/core';

@Component({
  templateUrl: 'home-desktop.component.html',
  styleUrls: ['home-desktop.component.scss'],
  host: { 'app.profile.home-desktop': 'true' }
})
export class HomeDesktopComponent { }
