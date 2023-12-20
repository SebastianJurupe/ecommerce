import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  private searchValue: string = '';

  getSearchValue(): string {
    return this.searchValue;
  }

  setSearchValue(value: string) {
    this.searchValue = value;
  }
}