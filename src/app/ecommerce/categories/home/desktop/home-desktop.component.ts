import { Component, Injector } from '@angular/core';
import { ProductGetDetailsDataDto } from '@shared/proxies/home/product.proxie';
import { HomeBaseComponent } from '../base/home-base.component';

@Component({
  templateUrl: 'home-desktop.component.html',
  styleUrls: ['home-desktop.component.scss'],
  host: { 'app.categories.home-desktop': 'true' },
})
export class HomeDesktopComponent extends HomeBaseComponent {


  product: ProductGetDetailsDataDto = new ProductGetDetailsDataDto();

  constructor(_injector: Injector) {
    super(_injector);
    setTimeout(() => { this.headerExtended.setFocus() }, 300);
  }

  onBlur() {
    this.headerDesktopService.updateValueInput(this.searchValue);
  }

  onSelectCategories(category: any) {
    const categoryId = category.id;
    const categoryName = category.name;
    const slug = category.slug;

    this.navigation.backNoAnimation(
      `/app/ecommerce/categories/category-products/${categoryId}`,
      { name: categoryName, slug: slug, id: categoryId }
    );
  }

  override async onSearchResult() {
    if (this.searchValue && typeof this.searchValue === 'string') {
      const lowercasedText = this.searchValue.toLowerCase();
      const isDuplicate = this.allSearches.some(searchItem => searchItem.text.toLowerCase() === lowercasedText);

      if (!isDuplicate) {
        const searchUrl = `/app/ecommerce/categories/products-filter?searchValue=${encodeURIComponent(this.searchValue)}`;
        this.allSearches.unshift({ text: lowercasedText, url: searchUrl });
        if (this.allSearches.length > 20) {
          this.allSearches.pop();
        }
      }

      this.navigation.backNoAnimation(`/app/ecommerce/categories/products-filter`, {
        searchValue: this.searchValue,
      });
    }
  }

  override onSearch(event: Event) {
    const inputEvent = event as InputEvent;
    if (inputEvent && inputEvent.target instanceof HTMLInputElement) {
      const text = inputEvent.target.value.toLowerCase().trim();
      this.searchValue = text;
      this._searchSubject.next(text);
    }
  }

  override async onSaveSearch(sentence: string) {
    const text = sentence.toLowerCase();
    this.searchValue = sentence;

    if (text !== '') {
      this.onPerformSearch(text);
      this.onSearchResult();
      this.headerExtended.setBlur();
      this.popoverController.dismiss();
    }
  }
}