import { Component, Injector, Output, EventEmitter } from '@angular/core';
import { ProductServiceProxy } from '@shared/proxies/home/product.proxie';
import { FilterBaseComponent } from '../base/filter-base.component';
interface Resultado {
  attribute_id: number;
  value_id: number;
}
@Component({
  selector: 'app-filter-mobile',
  templateUrl: 'filter-mobile.component.html',
  styleUrls: ['filter-mobile.component.scss'],
  host: { 'app.filter-mobile': 'true' },
})
export class FilterMobileComponent extends FilterBaseComponent {

  @Output() onFilterApplied = new EventEmitter<any>();
  @Output() onFiltersChanged = new EventEmitter<any>();

  showCategoryLabel: boolean = true;
  showFilterIcon: boolean = true;
  showVariants: boolean = true;

  constructor(_injector: Injector) {
    super(_injector);
    this.productServiceProxy = _injector.get(ProductServiceProxy);
  }

  onToggleVariants(variantName: string) {
    this.variantExpansionState[variantName] =
      !this.variantExpansionState[variantName];
  }

  onSelectVariant(variantName: string, value: string) {
    this.selectedVariants[variantName] = value;
  }

  isVariantSelected(variantName: string, value: string): boolean {
    return this.selectedVariants[variantName] === value;
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

    this.variantsAll = resultados

    const selectedFilters = {
      selectedCategory: this.selectedCategory,
      selectedMinPrice: this.selectedMinPrice,
      selectedMaxPrice: this.selectedMaxPrice,
      selectedVariants: this.selectedVariants,
      selectedColor: this.selectedColor,
      selectedCategoryId: this.selectedCategoryId,
      variantsAll: this.variantsAll
    };

    this.onFilterApplied.emit(selectedFilters);
    this.dialog.dismiss(selectedFilters);
  }

  closeModal() {
    this.onApply()
  }
}
