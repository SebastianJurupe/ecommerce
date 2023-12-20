import { Component, EventEmitter, Injector, OnInit, Input, Output } from '@angular/core';
import { ViewComponent } from '@geor360/core';
import { ProductServiceProxy } from '@shared/proxies/home/product.proxie';
interface Category {
  id: number;
  name: string;
  slug: string;
  products_count: number;
}
@Component({
  selector: 'app-filter-base',
  templateUrl: 'filter-base.component.html',
  styleUrls: ['filter-base.component.scss'],
  host: { 'app.filter-base': 'true' }
})
export class FilterBaseComponent extends ViewComponent implements OnInit {

  @Input() openedFromCategoryProducts: boolean = false;
  @Input() variantsCommonsWithValues: any[] | undefined;

  @Output() onClearFilters = new EventEmitter<void>();

  attributes: any[] = [];
  categories: Category[] = [];
  productServiceProxy: ProductServiceProxy;
  selectedCategory: string = '';
  selectedCategoryId: number = 0;
  selectedColor: string = '';
  selectedMaxPrice: any = '';
  selectedMinPrice: any = '';
  selectedVariants: { [key: string]: string | null; } = {};
  showCategories: boolean = true;
  showPrice: boolean = true;
  variantExpansionState: { [key: string]: boolean; } = {};
  selectedVariansAndColor: { [key: string]: string | null; } = {};
  variantsAll: any
  constructor(_injector: Injector) {
    super(_injector);
    this.productServiceProxy = _injector.get(ProductServiceProxy);
  }

  ngOnInit() {
    const slug = '';

    this.onGetCategories(slug, !this.openedFromCategoryProducts);
    if (this.variantsCommonsWithValues) {
      this.variantsCommonsWithValues.forEach((variant) => {
        this.variantExpansionState[variant.name] = true;
      });
    }

    this.onGetAttributes();

  }

  onGetCategories(slug: string, showCategories: boolean = true) {
    if (showCategories) {
      this.productServiceProxy.getCategories(slug).subscribe({
        next: (response) => {
          this.categories = response.data.filter((category: Category) => category.products_count > 0);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  onGetAttributes() {
    this.productServiceProxy.getAuxiliaryTables().subscribe({
      next: (response) => {
        const attributes = response.data.attributes;
        if (attributes && attributes.length > 0) {
          this.attributes = attributes;
          this.attributes.forEach(attribute => {
            attribute.showAttributes = true;
          });
        }
      },
    });
  }

  onToggleCategories() {
    this.showCategories = !this.showCategories;
  }

  onSelectCategory(slug: string, id: number) {
    this.selectedCategory = slug;
    this.selectedCategoryId = id
  }

  onToggleColorSelection(color: string) {
    this.selectedColor = this.selectedColor === color ? '' : color;
  }

  onTogglePrice() {
    this.showPrice = !this.showPrice;
  }

  onInput(content: any, label: string) {
    if (label === 'Min') {
      this.selectedMinPrice = parseFloat(content);
      this.selectedMinPrice = isNaN(this.selectedMinPrice) ? 0 : this.selectedMinPrice
    } else if (label === 'Max') {
      this.selectedMaxPrice = parseFloat(content);
      this.selectedMaxPrice = isNaN(this.selectedMaxPrice) ? 0 : this.selectedMaxPrice
    }
  }

  onCleanFilters() {
    this.onClearFilters.emit();
    this.selectedCategory = '';
    this.selectedColor = '';
    this.selectedMaxPrice = '';
    this.selectedMinPrice = '';
    this.selectedVariants = {};
    this.selectedCategoryId = 0
    this.variantsAll = []
  }


}