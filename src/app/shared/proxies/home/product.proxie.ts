import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from "rxjs";

@Injectable()
export class ProductServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  getBanners(): Observable<ProductGetBannersOutputDto> {
    const url = `${this.path}/api/services/app/Product/GetBanners`;

    return this.request.get(url);
  }

  getCategoriesDetail(category: string, per_page?: string, page?: string): Observable<ProductGetCategoriesDetailOutputDto> {
    let url = `${this.path}/api/services/app/Product/GetCategoriesDetail`;

    // if (environment.id_company !== null && environment.id_company !== undefined) {
    //   url += `?id_company=${encodeURIComponent('' + environment.id_company)}`;
    // }

    if (category !== null && category !== undefined) {
      url += `?category=${encodeURIComponent('' + category)}`;
    }

    if (per_page !== null && per_page !== undefined) {
      url += `&per_page=${encodeURIComponent('' + per_page)}`;
    }

    if (page !== null && page !== undefined) {
      url += `&page=${encodeURIComponent('' + page)}`;
    }

    url.replace(/[?&]$/, '');

    return this.request.get(url);
  }

  getCategories(name?: string) {
    let url = `${this.path}/api/services/app/Product/GetCategories`;

    // if (environment.id_company !== null && environment.id_company !== undefined) {
    //   url += `?id_company=${encodeURIComponent('' + environment.id_company)}`;
    // }

    if (name !== null && name !== undefined) {
      url += `?name=${encodeURIComponent('' + name)}`;
    }

    url.replace(/[?&]$/, '');

    return this.request.get(url);
  }

  getAuxiliaryTables() {
    let url = `${this.path}/api/services/app/Product/GetAuxiliaryTables`;

    // if (environment.id_company !== null && environment.id_company !== undefined) {
    //   url += `?id_company=${encodeURIComponent('' + environment.id_company)}`;
    // }

    url.replace(/[?&]$/, '');

    return this.request.get(url);
  }

  getAll(description?: string, page?: number, limit?: number, categories?: number[], attributes?: any[], min_price?: number, max_price?: number, sort_by?: string, sort_direction?: string) {
    let url = `${this.path}/api/services/app/Product/GetAll`;

    const body: string = JSON.stringify({
      description: description,
      page: page,
      limit: limit,
      categories: categories,
      attributes: attributes,
      min_price: min_price,
      max_price: max_price,
      sort_by: sort_by,
      sort_direction: sort_direction

    });
    return this.request.post(url, body);
  }

  getProductByCode(code: string) {
    const url = `${this.path}/api/services/app/Product/GetAll`;

    const body: string = JSON.stringify({
      description: undefined,
      page: 0,
      limit: 0,
      barcode: code,
      categories: undefined,
      attributes: undefined,
      min_price: 0,
      max_price: 0,
      sort_by: undefined,
      sort_direction: undefined
    });

    return this.request.post(url, body);
  }

  getProductsDetail(id: number) {
    let url = `${this.path}/api/services/app/Product/GetProductsDetail`;

    // if (environment.id_company !== null && environment.id_company !== undefined) {
    //   url += `?id_company=${encodeURIComponent('' + environment.id_company)}`;
    // }

    if (id !== null && id !== undefined) {
      url += `?id=${encodeURIComponent('' + id)}`;
    }

    url.replace(/[?&]$/, '');

    return this.request.get(url);
  }
}

export class ProductGetBannersOutputDto implements IFromJsonConvertable<ProductGetBannersOutputDto> {

  data: ProductGetBannersOutputDataDto[] = [];
  success: boolean = false;
  message: string = '';

  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.data = data['data'];
      this.success = data['success'];
      this.message = data['message'];
    }
  }

  fromJS(data: any): ProductGetBannersOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }

}

export class ProductGetBannersOutputDataDto {
  description: string = '';
  image_desktop: string = '';
  image_movil: string = '';
  link_type: string = '';
  link_model: string = '';
  link_url: string = '';
  link_value: string = '';
}



export class ProductGetCategoriesDetailOutputDto implements IFromJsonConvertable<ProductGetCategoriesDetailOutputDto> {
  data: ProductGetCategoriesDetailOutputDataDto = {
    name: '',
    slug: '',
    description: "",
    cover_desktop: "",
    cover_movil: "",
    products_count: 0,
    products: []
  };
  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.data = data['data'];
    }
  }
  fromJS(data: any): ProductGetCategoriesDetailOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class ProductGetCategoriesDetailOutputDataDto {
  name: string = '';
  slug: string = '';
  description: string = '';
  cover_desktop: string = '';
  cover_movil: string = '';
  products_count: number = 0;
  products: ProductGetCategoriesDetailOutputProductsDto[] = [];
}

export class ProductGetCategoriesDetailOutputProductsDto {
  id: number = 0;
  description: string = '';
  internal_id: string = '';
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
  prices: ProductGetCategoriesDetailOutputPricesDto[] = [];
  has_variants: boolean = false;
  files: ProductGetCategoriesDetailOutputFileDto[] = [];
  variants: ProductGetDetailsVariantsDto[] = [];
  currency: ProductGetCategoriesDetailOutputCurrencyDto = {
    id: '',
    description: '',
    symbol: ''
  };
  unit_type: ProductGetCategoriesDetailOutputUnitTypeDto = {
    id: '',
    description: ''
  };
  stock: number = 0
}

class ProductGetCategoriesDetailOutputUnitTypeDto {
  id: string = '';
  description: string = '';
}

class ProductGetCategoriesDetailOutputCurrencyDto {
  id: string = '';
  description: string = '';
  symbol: string = '';
}

class ProductGetCategoriesDetailOutputFileDto {
  id: number = 0;
  description: string = '';
  is_cover: boolean = false;
  path: string = '';
}

class ProductGetCategoriesDetailOutputPricesDto {
  price: number = 0;
  max_quantity: number = 0;
  min_quantity: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
}

class ProductGetDetailsVariantsDto {
  id: number = 0;
  sku: string = '';
  price: number = 0;
  in_offer: number = 0;
  offer_price: number = 0;
  stock: number = 0;
  prices: ProductGetDetailsPricesDto[] = [];
  values: ProductGetDetailsValuesDto[] = [];
  files: ProductGetDetailsFilesDto[] = [];
}

class ProductGetDetailsFilesDto {
  id: number = 0;
  description: string = '';
  is_cover: boolean = false;
  path: string = '';
}

class ProductGetDetailsValuesDto {
  id: number = 0;
  attribute: string = '';
  value: string = '';
  color: string = '';
}

class ProductGetDetailsPricesDto {
  price: number = 0;
  max_quantity: number = 0;
  min_quantity: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
}


export class ProductGetAllOutputDto implements IFromJsonConvertable<ProductGetAllOutputDto> {
  data: ProductGetAllOutputDataDto[] = [];
  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.data = data['data'];
    }
  }
  fromJS(data: any): ProductGetAllOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}


export class ProductGetAllOutputDataDto {
  id: number = 0;
  description: string = '';
  internal_id: string = '';
  barcode: string = '';
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
  prices: ProductGetAllOutputPricesDto[] = [];
  has_variants: boolean = false;
  files: ProductGetAllOutputFilesDto[] = [];
  variants: ProductGetAllOutputVariantsDto[] = [];
  currency!: ProductGetAllOutputCurrencyDto;
  unit_type!: ProductGetAllOutputUnitTypeDto;
  stock: number = 0;
}

class ProductGetAllOutputPricesDto {
  price: number = 0;
  max_quantity: number = 0;
  min_quantity: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
}

class ProductGetAllOutputFilesDto {
  id: number = 0;
  description: string = '';
  is_cover: boolean = false;
  path: string = '';
}

class ProductGetAllOutputVariantsDto {
  id: number = 0;
  sku: string = '';
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
  stock: number = 0;
  prices: ProductGetAllOutputPricesDto[] = [];
  values: string[] = [];
  files: ProductGetAllOutputFilesDto[] = [];
  currency: ProductGetAllOutputCurrencyDto[] = [];
  unit_type: ProductGetAllOutputUnitTypeDto[] = [];
}

class ProductGetAllOutputCurrencyDto {
  id: string = '';
  description: string = '';
  symbol: string = '';
}

class ProductGetAllOutputUnitTypeDto {
  id: string = '';
  description: string = '';
}

export class ProductGetDetailsOutputDto implements IFromJsonConvertable<ProductGetDetailsOutputDto> {
  data: ProductGetDetailsDataDto = {
    id: 0,
    description: "",
    internal_id: "",
    price: 0,
    in_offer: false,
    stock: 0,
    offer_price: 0,
    prices: [],
    has_variants: false,
    files: [],
    variants: [],
    currency: new ProductGetDetailsCurrencyDto,
    unit_type: new ProductGetDetailsUnitTypeDto,
    additional: new ProductGetDetailsAdditionalDto,
    specifications: []
  };
  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data?: any) {
    if (data) {
      this.data = data['data'];
    }
  }
  fromJS(data: any): ProductGetDetailsOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}


export class ProductGetDetailsDataDto {
  id: number = 0;
  description: string = '';
  internal_id: string = '';
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
  stock: number = 0;
  prices: ProductGetDetailsPricesDto[] = [];
  has_variants: boolean = false;
  files: ProductGetDetailsFilesDto[] = [];
  variants: ProductGetDetailsVariantsDto[] = [];
  currency: ProductGetDetailsCurrencyDto = {
    id: "",
    description: "",
    symbol: ""
  };
  unit_type: ProductGetDetailsUnitTypeDto = {
    id: "",
    description: ""
  };
  additional: ProductGetDetailsAdditionalDto = {
    value: ""
  };
  specifications: ProductGetDetailsSpecificationsDto[] = [];

}


class ProductGetDetailsUnitTypeDto {
  id: string = '';
  description: string = '';
}

class ProductGetDetailsCurrencyDto {
  id: string = '';
  description: string = '';
  symbol: string = '';
}

export class ProductGetDetailsAdditionalDto {
  value: string = '';
}

class ProductGetDetailsSpecificationsDto {
  specification: string = '';
  value: string = '';
}

