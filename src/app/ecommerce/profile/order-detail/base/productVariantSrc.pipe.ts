import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productVariantSrc'
})
export class ProductVariantSrcPipe implements PipeTransform {

  transform(productData: any, variants: any, variantId: number): any {
    const purchasedVariantsIds: number[] = productData.variants.map((value: any) => value.id);
    const purchasedVariantsData: any[] = variants.filter((value: any) => purchasedVariantsIds.includes(value.id));
    const filterVariantData = purchasedVariantsData.find((value: any) => value.id === variantId);
    const files = filterVariantData.files[0];

    return files ? files.path : '';
  }

}
