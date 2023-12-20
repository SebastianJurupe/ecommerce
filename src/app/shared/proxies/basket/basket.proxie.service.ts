import { Injectable, Injector } from "@angular/core";
import { AppHttpRequestService, IFromJsonConvertable } from "@geor360/core";
import { Observable } from "rxjs";

@Injectable()
export class BasketServiceProxy {
  private request: AppHttpRequestService;

  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  cartDeleteProduct(code: string, item_number: number): Observable<CartDeleteProductOutputDto> {
    let url = `${this.path}/api/services/app/Cart/CartDeleteProduct`;

    const body: string = JSON.stringify({
      code: code,
      item_number: item_number,
    });

    return this.request.post(url, body);
  }

  cartAddProduct(item_id: number, quantity: number, variants: variants[] = []): Observable<CartAddProductOutputDataDto> {
    let url = `${this.path}/api/services/app/Cart/CartAddProduct`;

    const body: string = JSON.stringify({
      "item_id": item_id,
      "quantity": quantity,
      "variants": variants.length > 0 ?
        variants
        : null
    });
    return this.request.post(url, body);
  }

  getCart(): Observable<CartGetOutputDto> {
    let url = `${this.path}/api/services/app/Cart/Get`;
    return this.request.get(url);
  }

  cartPay(shipping_type: string, agency_code: string | undefined, establishment_id: number | undefined, ubigeo: string, address: string, extra: any, postal_code: string, arrives_from: string, arrives_to: string, receives_name: string, receives_extra: object | string, requirements: string, payment_method: string, billing_id: number | null, coupon_code: string, origin: string): Observable<void> {
    let url = `${this.path}/api/services/app/Cart/CartPay`;
    const body: string = JSON.stringify({
      shipping_type: shipping_type,
      agency_code: agency_code,
      establishment_id: establishment_id,
      ubigeo: ubigeo,
      address: address,
      extra: extra,
      postal_code: postal_code,
      arrives_from: arrives_from,
      arrives_to: arrives_to,
      receives_name: receives_name,
      receives_extra: receives_extra,
      requirements: requirements,
      payment_method: payment_method,
      billing_id: billing_id,
      coupon_code: coupon_code,
      origin: origin
    });
    return this.request.post(url, body);
  }

  getCouponsAvalibles(): Observable<CartGetCouponsAvaliblesOutputDto> {
    let url = `${this.path}/api/services/app/Cart/GetCouponsAvalibles`;
    return this.request.get(url);
  }

  getCouponsCalculate(code: string) {
    let url = `${this.path}/api/services/app/Cart/GetCouponsCalculate`;

    if (code !== null && code !== undefined) {
      url += `?code=${encodeURIComponent('' + code)}`;
    }

    url.replace(/[?&]$/, '');
    return this.request.get(url);
  }
}


export class variants {
  "id": number;
  "quantity": number;
}

export class CardDeleteOutputDto {
  success: boolean = false;
  message: string = "";
}



export class CartAddProductOutputDto implements IFromJsonConvertable<CartAddProductOutputDto> {
  data: CartAddProductOutputDataDto = {
    code: "",
    status: "",
    payment_method: "",
    quantity: 0,
    subtotal: 0,
    total_taxes: 0,
    discounts: 0,
    total: 0,
    items: []
  };
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
  fromJS(data: any): CartAddProductOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class CartGetOutputDto implements IFromJsonConvertable<CartGetOutputDto> {
  data: CartGetDataDto = {
    code: "",
    status: "",
    payment_method: "",
    quantity: 0,
    subtotal: 0,
    total_taxes: 0,
    discounts: 0,
    total: 0,
    items: []
  };
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
  fromJS(data: any): CartGetOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class CartAddProductOutputDataDto {
  code: string = "";
  status: string = "";
  payment_method: string = "";
  quantity: number = 0;
  subtotal: number = 0;
  total_taxes: number = 0;
  discounts: number = 0;
  total: number = 0;
  items: CartAddProductOutputItemsDto[] = [];
}

class CartAddProductOutputItemsDto {
  id: number = 0;
  quantity: number = 0;
  subtotal: number = 0;
  total_taxes: number = 0;
  discounts: number = 0;
  total: number = 0;
  data: CartAddProductOutputItemsDataDto = {
    item_id: 0,
    quantity: 0
  };
  item: CartAddProductOutputItemsItemDto = {
    id: 0,
    files: [],
    price: 0,
    stock: 0,
    prices: [],
    currency: new CartAddProductOutputItemsCurrencyDto,
    in_offer: false,
    variants: [],
    unit_type: new CartAddProductOutputItemsUnitTypeDto,
    additional: new CartAddProductOutputItemsAdditionalDto,
    description: "",
    internal_id: "",
    offer_price: 0,
    has_variants: false,
    specifications: []
  };
}

class CartAddProductOutputItemsDataDto {
  item_id: number = 0;
  quantity: number = 0;
}

class CartAddProductOutputItemsItemDto {
  id: number = 0;
  files: CartAddProductOutputItemsFilesDto[] = [];
  price: number = 0;
  stock: number = 0;
  prices: CartAddProductOutputItemsPricesDto[] = [];
  currency: CartAddProductOutputItemsCurrencyDto = {
    id: "",
    description: "",
    symbol: ""
  };
  in_offer: boolean = false;
  variants: CartAddProductOutputItemsVariantsDto[] = [];
  unit_type: CartAddProductOutputItemsUnitTypeDto = {
    id: "",
    description: ""
  };
  additional: CartAddProductOutputItemsAdditionalDto = {
    value: ""
  };
  description: string = "";
  internal_id: string = "";
  offer_price: number = 0;
  has_variants: boolean = false;
  specifications: CartAddProductOutputItemsSpecificationsDto[] = [];
}

class CartAddProductOutputItemsFilesDto {
  id: number = 0;
  path: string = "";
  is_cover: boolean = false;
  description: string = "";
}

class CartAddProductOutputItemsPricesDto {
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
  max_quantity: number = 0;
  min_quantity: number = 0;
}

class CartAddProductOutputItemsCurrencyDto {
  id: string = '';
  description: string = '';
  symbol: string = '';
}

class CartAddProductOutputItemsVariantsDto {
  id: number = 0;
  sku: string = '';
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
  stock: number = 0;
  prices: CartAddProductOutputItemsPricesDto[] = [];
  values: CartAddProductOutputItemsValuesDto[] = [];
  files: CartAddProductOutputItemsFilesDto[] = [];
}


class CartAddProductOutputItemsValuesDto {
  id: number = 0;
  attribute: string = '';
  value: string = '';
  color: string = '';
  is_main: boolean = false;
}

class CartAddProductOutputItemsUnitTypeDto {
  id: string = '';
  description: string = '';
}

class CartAddProductOutputItemsAdditionalDto {
  value: string = '';
}


class CartAddProductOutputItemsSpecificationsDto {
  specifications: string = '';
  value: string = '';
}

export class CartGetDataDto {
  code: string = '';
  status: string = '';
  payment_method: string = '';
  quantity: number = 0;
  subtotal: number = 0;
  total_taxes: number = 0;
  discounts: number = 0;
  total: number = 0;
  items: CartGetDataItemsDto[] = [];
}

export class CartGetDataItemsDto {
  id: number = 0;
  quantity: number = 0;
  subtotal: number = 0;
  total_taxes: number = 0;
  discounts: number = 0;
  total: number = 0;
  data: CartGetDataItemsDataDto = {
    item_id: 0,
    quantity: 0
  };
  item: ProductGetDetailsDataDto = {
    id: 0,
    description: "",
    internal_id: "",
    price: 0,
    in_offer: false,
    offer_price: 0,
    prices: [],
    has_variants: false,
    files: [],
    variants: [],
    currency: new ProductGetDetailsCurrencyDto,
    unit_type: new ProductGetDetailsUnitTypeDto,
    additional: new ProductGetDetailsAdditionalDto,
    specifications: new ProductGetDetailsSpecificationsDto
  };
}

class CartGetDataItemsDataDto {
  item_id: number = 0;
  quantity: number = 0;
}

export class ProductGetDetailsDataDto {
  id: number = 0;
  description: string = '';
  internal_id: string = '';
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
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
  specifications: ProductGetDetailsSpecificationsDto = {
    specifications: "",
    value: ""
  };
}

class ProductGetDetailsAdditionalDto {
  value: string = '';
}

class ProductGetDetailsSpecificationsDto {
  specifications: string = '';
  value: string = '';
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


class ProductGetDetailsPricesDto {
  price: number = 0;
  max_quantity: number = 0;
  min_quantity: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
}


class ProductGetDetailsValuesDto {
  id: number = 0;
  attribute: string = '';
  value: string = '';
  color: string = '';
}

export class CartDeleteProductOutputDto implements IFromJsonConvertable<CartDeleteProductOutputDto> {
  data: CartDeleteProductOutputDataDto = {
    code: "",
    status: "",
    payment_method: "",
    quantity: 0,
    subtotal: 0,
    total_taxes: 0,
    discounts: 0,
    total: 0,
    items: []
  };
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
  fromJS(data: any): CartDeleteProductOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}


export class CartDeleteProductOutputDataDto {
  code: string = "";
  status: string = "";
  payment_method: string = "";
  quantity: number = 0;
  subtotal: number = 0;
  total_taxes: number = 0;
  discounts: number = 0;
  total: number = 0;
  items: CartDeleteProductOutputItemDto[] = [];
}


class CartDeleteProductOutputItemDto {
  id: number = 0;
  quantity: number = 0;
  subtotal: number = 0;
  total_taxes: number = 0;
  discounts: number = 0;
  total: number = 0;
  files: CartDeleteProductOutputFileDto[] = [];
  price: number = 0;
  stock: number = 0;
  prices: CartDeleteProductOutputPriceDto[] = [];
  currency: CartDeleteProductOutputCurrencyDto = {
    id: "",
    description: "",
    symbol: ""
  };
  in_offer: boolean = false;
  variants: CartDeleteProductOutputVariantDto[] = [];
  unit_type: CartDeleteProductOutputUnitTypeDto = {
    id: "",
    description: ""
  };
  additional: CartDeleteProductOutputAdditionalDto = {
    value: ""
  };
  description: string = "";
  internal_id: string = "";
  offer_price: number = 0;
  has_variants: boolean = false;
  specifications: CartDeleteProductOutputSpecificationDto[] = [];
}

class CartDeleteProductOutputFileDto {
  id: number = 0;
  path: string = "";
  is_cover: boolean = false;
  description: any = {
  };
}

class CartDeleteProductOutputPriceDto {
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
  max_quantity: number = 0;
  min_quantity: number = 0;
}

class CartDeleteProductOutputCurrencyDto {
  id: string = '';
  description: string = '';
  symbol: string = '';
}

class CartDeleteProductOutputVariantDto {
  id: number = 0;
  sku: string = '';
  files: CartDeleteProductOutputFileDto[] = [];
  price: number = 0;
  stock: number = 0;
  prices: CartDeleteProductOutputPriceDto[] = [];
  values: CartDeleteProductOutputValueDto[] = [];
  in_offer: boolean = false;
  offer_price: number = 0;
}


class CartDeleteProductOutputValueDto {
  id: number = 0;
  color: string = '';
  value: string = '';
  is_main: string = '';
  attribute: string = '';
}

class CartDeleteProductOutputUnitTypeDto {
  id: string = '';
  description: string = '';
}

class CartDeleteProductOutputAdditionalDto {
  value: string = '';
}

class CartDeleteProductOutputSpecificationDto {
  value: string = '';
  specification: string = '';
}

export class CartGetCouponsAvaliblesOutputDto implements IFromJsonConvertable<CartGetCouponsAvaliblesOutputDto> {
  data: CartGetCouponsAvaliblesOutputDataDto[] = [];
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

  init(data: any): void {
    if (data) {
      this.data = data['data'];
      this.success = data['success'];
      this.message = data['message'];
    }
  }

  fromJS(data: any): CartGetCouponsAvaliblesOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class CartGetCouponsAvaliblesOutputDataDto {
  code: string = '';
  description: string = '';
  discount_amount: number = 0;
  discount_type: string = '';
  due_date: string = '';
  conditions: string = '';
  used: boolean = false;

  constructor(data?: any) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(data: any): void {
    if (data) {
      this.code = data['code'];
      this.description = data['description'];
      this.discount_amount = data['discount_amount'];
      this.discount_type = data['discount_type'];
      this.due_date = data['due_date'];
      this.conditions = data['conditions'];
      this.used = data['used'];
    }
  }

  fromJS(data: any): CartGetCouponsAvaliblesOutputDataDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}