import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productVariantsDetail'
})
export class ProductVariantsDetailPipe implements PipeTransform {

  transform(productData: any, variants: any, variantId: number): any {
    const purchasedVariantsIds: number[] = productData.variants.map((value: any) => value.id);
    const purchasedVariantsData: any[] = variants.filter((value: any) => purchasedVariantsIds.includes(value.id));
    const filterVariantData = purchasedVariantsData.find((value: any) => value.id === variantId);

    const variantValues = filterVariantData.values;

    let variantDetails = '';
    let i = 0;
    for (const item of variantValues) {
      variantDetails = variantDetails + item.value + (i < variantValues.length - 1 ? ', ' : '');
      i++;
    }

    return variantDetails;
  }

}
