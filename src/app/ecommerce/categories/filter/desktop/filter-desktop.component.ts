import { Component, EventEmitter, Injector, Output, } from '@angular/core';
import { ProductServiceProxy } from '@shared/proxies/home/product.proxie';
import { FilterBaseComponent } from '../base/filter-base.component';
interface Resultado {
  attribute_id: number;
  value_id: number;
}
@Component({
  selector: 'app-filter-desktop',
  templateUrl: 'filter-desktop.component.html',
  styleUrls: ['filter-desktop.component.scss'],
  host: { 'app.filter-desktop': 'true' }
})
export class FilterDesktopComponent extends FilterBaseComponent {

  @Output() onFilterApplied = new EventEmitter<any>();

  areFiltersCleared: boolean = false;
  color: any[] = [];
  isApplying: boolean = true;
  languages = {
    filter: this.localization.localize('categories.filter.title', 'ecommerce'),
    clear: this.localization.localize('categories.filter.textClean', 'ecommerce')
  };
  showAttributes: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
    this.productServiceProxy = _injector.get(ProductServiceProxy);
  }

  onToggleApplyOrClean() {
    if (this.onHasSelections()) {
      if (this.isApplying) {
        this.onApply();
      } else {
        this.onCleanFilters();
      }
      this.isApplying = !this.isApplying;
    }
  }

  onToggleAttributes(description: string) {
    const attribute = this.attributes.find(attr => attr.description === description);

    if (attribute) {
      attribute.showAttributes = !attribute.showAttributes;
    }
  }

  onToggleCategorySelection(slug: string, id: number) {
    if (this.selectedCategory === slug) {
      this.selectedCategory = '';
      this.selectedCategoryId = 0
    } else {
      this.selectedCategory = slug;
      this.selectedCategoryId = id
    }
  }

  onToggleAttributeSelection(description: string, value: string) {
    if (!this.selectedVariants.hasOwnProperty(description)) {
      this.selectedVariants[description] = '';
    }

    this.selectedVariants[description] =
      this.selectedVariants[description] === value ? '' : value;

    if (this.selectedVariants[description] === null) {
      delete this.selectedVariants[description];
    }
  }

  onIsColorSelected(color: string): boolean {
    return this.selectedColor === color;
  }

  onIsAttributteSelected(description: string, value: string): boolean {
    return this.selectedVariants[description] === value;
  }

  onHasSelections(): boolean {
    return (
      this.selectedCategory !== '' ||
      this.selectedColor !== '' ||
      Object.keys(this.selectedVariants).length > 0 ||
      this.selectedMinPrice !== '' ||
      this.selectedMaxPrice !== ''
    );
  }


  onApply() {

    // let variantSelected = {

    // }
    const resultados: Resultado[] = [];

    for (const [clave, valor] of Object.entries(this.selectedVariants)) {
      const elemento = this.attributes.find(attr => attr.description === clave);

      if (elemento) {
        const valorEnArray = elemento.values.find((val: any) => {
          return val.value === valor;
        });

        if (valorEnArray) {
          resultados.push({
            attribute_id: elemento.id,
            value_id: valorEnArray.id
          });
        }
      }
    }

    if (this.selectedColor != null) {
      const elementColor = this.attributes.find(attr => attr.description.toLowerCase() === "color");

      if (elementColor && elementColor.values) {
        const valorEnArray = elementColor.values.find((val: any) => val.color.toLowerCase() === this.selectedColor.toLowerCase());

        if (valorEnArray) {
          resultados.push({
            attribute_id: elementColor.id,
            value_id: valorEnArray.id
          });
        }
      }
    }



    const selectedFilters = {
      selectedCategory: this.selectedCategory,
      selectedMinPrice: this.selectedMinPrice,
      selectedMaxPrice: this.selectedMaxPrice,
      selectedVariants: this.selectedVariants,
      selectedColor: this.selectedColor,
      selectedCategoryId: this.selectedCategoryId,
      variantsAll: resultados
    };

    this.onFilterApplied.emit(selectedFilters);
  }
}