import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as storeConfig from '../../../assets/config/config.json';
@Injectable({
  providedIn: 'root'
})
export class ConfigStoreService {

  constructor(private titleService: Title) { 
  }
 
  getConfig() {
    return  JSON.parse(JSON.stringify(storeConfig));
  }

  initTitle() : void{
    this.titleService.setTitle( JSON.parse(JSON.stringify(storeConfig)).storeName );
  }
  
}
