import { Injectable, Injector } from '@angular/core';
import { AppHttpRequestService, IFromJsonConvertable } from '@geor360/core';
import { Observable } from 'rxjs';

@Injectable()
export class OrderServiceProxy {
  private request: AppHttpRequestService;

  get path(): string {
    return this.request.api.store.path;
  }

  constructor(_injector: Injector) {
    this.request = _injector.get(AppHttpRequestService);
  }

  getAll(status?: string, page?: number): Observable<OrderGetAllOutputDto> {
    let url = `${this.path}/api/services/app/Order/GetAll`;

    if ((status !== null && status !== undefined) || (page !== null && page !== undefined)) {
      url += '?';
    }

    if (status !== null && status !== undefined) {
      url += `status=${encodeURIComponent('' + status)}`;
    }

    if (page !== null && page !== undefined) {
      if (status !== null && status !== undefined) {
        url += `&page=${encodeURIComponent('' + page)}`;
      } else {
        url += `page=${encodeURIComponent('' + page)}`;
      }
    }

    return this.request.get(url);
  }

  get(code: string): Observable<OrderGetOutputDto> {
    let url = `${this.path}/api/services/app/Order/Get`;

    if (code !== null && code !== undefined) {
      url += `?code=${encodeURIComponent('' + code)}`;
    }

    url = url.replace(/[?&]$/, '');

    return this.request.get(url);
  }

  cancel(code: string) {
    const url = `${this.path}/api/services/app/Order/Cancel`;

    const body = JSON.stringify({
      code: code,
    });

    return this.request.post(url, body);
  }

}

export class OrderGetAllOutputDto implements IFromJsonConvertable<OrderGetAllOutputDto> {

  links: OrderGetAllOutputLinksDto = new OrderGetAllOutputLinksDto();
  data: OrderGetAllOutputDataDto[] = [];
  meta: OrderGetAllOutputMetaDto = new OrderGetAllOutputMetaDto();
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
      this.links = data['links'];
      this.data = data['data'];
      this.meta = data['meta'];
      this.success = data['success'];
      this.message = data['message'];
    }
  }

  fromJS(data: any): OrderGetAllOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetAllOutputDataDto {
  code: string = '';
  order: string = '';
  created_at: string = '';
  items: number = 0;
  status: string = '';

  constructor(data?: any) {
    if (data) {
      this.code = data['code'];
      this.order = data['order'];
      this.created_at = data['created_at'];
      this.items = data['items'];
      this.status = data['status'];
    }
  }

  init(data: any): void {
    if (data) {
      this.code = data['code'];
      this.order = data['order'];
      this.created_at = data['created_at'];
      this.items = data['items'];
      this.status = data['status'];
    }
  }

  fromJS(data: any): OrderGetAllOutputDataDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }

}
export class OrderGetAllOutputLinksDto {
  first: string = '';
  last: string = '';
  prev: string = '';
  next: string = '';

  constructor(data?: any) {
    if (data) {
      this.first = data['first'];
      this.last = data['last'];
      this.prev = data['prev'];
      this.next = data['next'];
    }
  }

  init(data: any): void {
    if (data) {
      this.first = data['first'];
      this.last = data['last'];
      this.prev = data['prev'];
      this.next = data['next'];
    }
  }

  fromJS(data: any): OrderGetAllOutputLinksDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetAllOutputMetaDto {
  current_page: number = 0;
  from: number = 0;
  last_page: number = 0;
  path: string = '';
  per_page: number = 0;
  to: number = 0;
  total: number = 0;

  constructor(data?: any) {
    if (data) {
      this.current_page = data['current_page'];
      this.from = data['from'];
      this.last_page = data['last_page'];
      this.path = data['path'];
      this.per_page = data['per_page'];
      this.to = data['to'];
      this.total = data['total'];
    }
  }

  init(data: any): void {
    if (data) {
      this.current_page = data['current_page'];
      this.from = data['from'];
      this.last_page = data['last_page'];
      this.path = data['path'];
      this.per_page = data['per_page'];
      this.to = data['to'];
      this.total = data['total'];
    }
  }

  fromJS(data: any): OrderGetAllOutputMetaDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputDto implements IFromJsonConvertable<OrderGetOutputDto>{

  success: boolean = false;
  message: string = '';
  data: OrderGetOutputDataDto = new OrderGetOutputDataDto();

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
      this.success = data['success'];
      this.message = data['message'];
      this.data = data['data'];
    }
  }

  fromJS(data: any): OrderGetOutputDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputDataDto implements IFromJsonConvertable<OrderGetOutputDataDto>{

  code: string = '';
  order: string = '';
  status: string = '';
  payment_method: string = '';
  quantity: number = 0;
  subtotal: number = 0;
  total_taxes: number = 0;
  total_shipments: number = 0;
  discounts: number = 0;
  total: number = 0;
  items: OrderGetOutputItemsDto[] = [];
  shipment: OrderGetOutputShipmentDto = new OrderGetOutputShipmentDto();
  billing: OrderGetOutputBillingDto = new OrderGetOutputBillingDto();
  document: any
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
      this.status = data['status'];
      this.payment_method = data['payment_method'];
      this.quantity = data['quantity'];
      this.subtotal = data['subtotal'];
      this.total_taxes = data['total_taxes'];
      this.total_shipments = data['total_shipments'];
      this.discounts = data['discounts'];
      this.total = data['total'];
      this.items = data['items'];
      this.shipment = data['shipment'];
      this.document = data['document'];
    }
  }

  fromJS(data: any): OrderGetOutputDataDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}
export class OrderGetOutputItemsDto implements IFromJsonConvertable<OrderGetOutputItemsDto>{
  id: number = 0;
  quantity: number = 0;
  subtotal: number = 0;
  total_taxes: number = 0;
  discounts: number = 0;
  total: number = 0;
  data: OrderGetOutputItemsDataDto = new OrderGetOutputItemsDataDto();
  item: OrderGetOutputItemsItemDto = new OrderGetOutputItemsItemDto();

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
      this.id = data['id'];
      this.quantity = data['quantity'];
      this.subtotal = data['subtotal'];
      this.total_taxes = data['total_taxes'];
      this.discounts = data['discounts'];
      this.total = data['total'];
      this.data = data['data'];
      this.item = data['item'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputItemsDataDto implements IFromJsonConvertable<OrderGetOutputItemsDataDto>{
  item_id: number = 0;
  quantity: number = 0;
  variants: OrderGetOutputItemsDataVariantsDto[] = [];

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
      this.item_id = data['item_id'];
      this.quantity = data['quantity'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsDataDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputItemsDataVariantsDto implements IFromJsonConvertable<OrderGetOutputItemsDataVariantsDto>{
  id: number = 0;
  quantity: number = 0;

  constructor(data?: any) {
    if (data) {
      this.id = data['id'];
      this.quantity = data['quantity'];
    }
  }

  init(data: any): void {
    if (data) {
      this.id = data['id'];
      this.quantity = data['quantity'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsDataVariantsDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputItemsItemDto implements IFromJsonConvertable<OrderGetOutputItemsItemDto>{
  id: number = 0;
  brand: OrderGetOutputItemsBrandDto = new OrderGetOutputItemsBrandDto();
  files: OrderGetOutputItemsFilesDto[] = [];
  price: number = 0;
  stock: number = 0;
  prices: OrderGetOutputItemsPricesDto[] = [];
  weight: number = 0;
  barcode: string = '';
  currency: OrderGetOutputItemsCurrencyDto = new OrderGetOutputItemsCurrencyDto();
  in_offers: boolean = false;
  variants: any;
  min_order: number = 0;
  unit_type: OrderGetOutputItemsUnitTypeDto = new OrderGetOutputItemsUnitTypeDto();
  additional: string = '';
  description: string = '';
  internal_id: string = '';
  offer_price: number = 0;
  has_variants: boolean = false;
  specifications: any;

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
      this.id = data['id'];
      this.brand = data['brand'];
      this.files = data['files'];
      this.price = data['price'];
      this.stock = data['stock'];
      this.prices = data['prices'];
      this.weight = data['weight'];
      this.barcode = data['barcode'];
      this.currency = data['currency'];
      this.in_offers = data['in_offers'];
      this.variants = data['variants'];
      this.min_order = data['min_order'];
      this.unit_type = data['unit_type'];
      this.additional = data['additional'];
      this.description = data['description'];
      this.internal_id = data['internal_id'];
      this.offer_price = data['offer_price'];
      this.has_variants = data['has_variants'];
      this.specifications = data['specifications'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsItemDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputItemsBrandDto implements IFromJsonConvertable<OrderGetOutputItemsBrandDto>{
  id: number = 0;
  marca: string = '';

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
      this.id = data['id'];
      this.marca = data['marca'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsBrandDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputItemsFilesDto implements IFromJsonConvertable<OrderGetOutputItemsFilesDto>{
  id: number = 0;
  path: string = '';
  is_covered: boolean = false;
  description: string = '';

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
      this.id = data['id'];
      this.path = data['path'];
      this.is_covered = data['is_covered'];
      this.description = data['description'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsFilesDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputItemsPricesDto implements IFromJsonConvertable<OrderGetOutputItemsPricesDto>{
  price: number = 0;
  in_offer: boolean = false;
  offer_price: number = 0;
  max_quantity: number = 0;
  min_quantity: number = 0;

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
      this.price = data['price'];
      this.in_offer = data['in_offer'];
      this.offer_price = data['offer_price'];
      this.max_quantity = data['max_quantity'];
      this.min_quantity = data['min_quantity'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsPricesDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputItemsCurrencyDto implements IFromJsonConvertable<OrderGetOutputItemsCurrencyDto>{
  id: string = '';
  symbol: string = '';
  description: string = '';

  constructor(data?: any) {
    if (data) {
      this.id = data['id'];
      this.symbol = data['symbol'];
      this.description = data['description'];
    }
  }

  init(data: any): void {
    if (data) {
      this.id = data['id'];
      this.symbol = data['symbol'];
      this.description = data['description'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsCurrencyDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputItemsUnitTypeDto implements IFromJsonConvertable<OrderGetOutputItemsUnitTypeDto>{
  id: string = '';
  description: string = '';

  constructor(data?: any) {
    if (data) {
      this.id = data['id'];
      this.description = data['description'];
    }
  }

  init(data: any): void {
    if (data) {
      this.id = data['id'];
      this.description = data['description'];
    }
  }

  fromJS(data: any): OrderGetOutputItemsUnitTypeDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputShipmentDto implements IFromJsonConvertable<OrderGetOutputShipmentDto>{
  type: string = '';
  details?: OrderGetOuputDetailsDto = new OrderGetOuputDetailsDto();
  agency_code?: string = '';
  agency?: OrderGetOutputShipmentAgencyDto = new OrderGetOutputShipmentAgencyDto();
  establishment_id?: string = '';
  establishment?: OrderGetOutputShipmentStoreDto[] = [];
  weight: number = 0;
  subtotal: number = 0;
  total: number = 0;
  address: string = '';
  extra: OrderGetOutputExtraDto[] = [];
  postal_code: string = '';
  arrives_from: string = '';
  arrives_to: string = '';
  receives_name: string = '';
  requirements: string = '';

  constructor(data?: any) {
    if (data) {
      this.type = data['type'];
      this.details = data['details'];
      this.agency_code = data['agency_code'];
      this.agency = data['agency'];
      this.establishment_id = data['establishment_id'];
      this.establishment = data['establishment'];
      this.weight = data['weight'];
      this.subtotal = data['subtotal'];
      this.total = data['total'];
      this.address = data['address'];
      this.extra = data['extra'];
      this.postal_code = data['postal_code'];
      this.arrives_from = data['arrives_from'];
      this.arrives_to = data['arrives_to'];
      this.receives_name = data['receives_name'];
      this.requirements = data['requirements'];
    }
  }

  init(data: any): void {
    if (data) {
      this.type = data['type'];
      this.details = data['details'];
      this.agency_code = data['agency_code'];
      this.agency = data['agency'];
      this.establishment_id = data['establishment_id'];
      this.establishment = data['establishment'];
      this.weight = data['weight'];
      this.subtotal = data['subtotal'];
      this.total = data['total'];
      this.address = data['address'];
      this.extra = data['extra'];
      this.postal_code = data['postal_code'];
      this.arrives_from = data['arrives_from'];
      this.arrives_to = data['arrives_to'];
      this.receives_name = data['receives_name'];
      this.requirements = data['requirements'];
    }
  }

  fromJS(data: any): OrderGetOutputShipmentDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputShipmentAgencyDto implements IFromJsonConvertable<OrderGetOutputShipmentAgencyDto>{
  code: string = '';
  logo: string = '';
  name: string = '';
  price: number = 0;
  lead_time: number = 0;

  constructor(data?: any) {
    if (data) {
      this.code = data['code'];
      this.logo = data['logo'];
      this.name = data['name'];
      this.price = data['price'];
      this.lead_time = data['lead_time'];
    }
  }

  init(data: any): void {
    if (data) {
      this.code = data['code'];
      this.logo = data['logo'];
      this.name = data['name'];
      this.price = data['price'];
      this.lead_time = data['lead_time'];
    }
  }

  fromJS(data: any): OrderGetOutputShipmentAgencyDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputShipmentStoreDto implements IFromJsonConvertable<OrderGetOutputShipmentStoreDto>{
  id: number = 0;
  logo: string = '';
  address: string = '';
  district: string = '';
  latitude: string = '';
  province: string = '';
  lead_time: string = '';
  longitude: string = '';
  department: string = '';
  description: string = '';

  constructor(data?: any) {
    if (data) {
      this.id = data['id'];
      this.logo = data['logo'];
      this.address = data['address'];
      this.district = data['district'];
      this.latitude = data['latitude'];
      this.province = data['province'];
      this.lead_time = data['lead_time'];
      this.longitude = data['longitude'];
      this.department = data['department'];
      this.description = data['description'];
    }
  }

  init(data: any): void {
    if (data) {
      this.id = data['id'];
      this.logo = data['logo'];
      this.address = data['address'];
      this.district = data['district'];
      this.latitude = data['latitude'];
      this.province = data['province'];
      this.lead_time = data['lead_time'];
      this.longitude = data['longitude'];
      this.department = data['department'];
      this.description = data['description'];
    }
  }

  fromJS(data: any): OrderGetOutputShipmentStoreDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}


export class OrderGetOuputDetailsDto implements IFromJsonConvertable<OrderGetOuputDetailsDto>{
  price: number = 0;
  lead_time: number = 0;

  constructor(data?: any) {
    if (data) {
      this.price = data['price'];
      this.lead_time = data['lead_time'];
    }
  }

  init(data: any): void {
    if (data) {
      this.price = data['price'];
      this.lead_time = data['lead_time'];
    }
  }

  fromJS(data: any): OrderGetOuputDetailsDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;

  }
}

export class OrderGetOutputExtraDto implements IFromJsonConvertable<OrderGetOutputExtraDto>{
  ubigeo: string = '';
  departamento: string = '';

  constructor(data?: any) {
    if (data) {
      this.ubigeo = data['ubigeo'];
      this.departamento = data['departamento'];
    }
  }

  init(data: any): void {
    if (data) {
      this.ubigeo = data['ubigeo'];
      this.departamento = data['departamento'];
    }
  }

  fromJS(data: any): OrderGetOutputExtraDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputBillingDto implements IFromJsonConvertable<OrderGetOutputBillingDto>{
  province: OrderGetOutputBillingProvinceto = new OrderGetOutputBillingProvinceto();
  department: OrderGetOutputBillingDepartmentDto = new OrderGetOutputBillingDepartmentDto();
  district: OrderGetOutputBillingDistrictDto = new OrderGetOutputBillingDistrictDto();
  billing_id: number = 0;
  business_name: string = '';
  fiscal_address: string = '';
  tax_identifier: string = '';

  constructor(data?: any) {
    if (data) {
      this.province = data['province'];
      this.department = data['department'];
      this.district = data['district'];
      this.billing_id = data['billing_id'];
      this.business_name = data['business_name'];
      this.fiscal_address = data['fiscal_address'];
      this.tax_identifier = data['tax_identifier'];
    }
  }

  init(data: any): void {
    if (data) {
      this.province = data['province'];
      this.department = data['department'];
      this.district = data['district'];
      this.billing_id = data['billing_id'];
      this.business_name = data['business_name'];
      this.fiscal_address = data['fiscal_address'];
      this.tax_identifier = data['tax_identifier'];
    }
  }

  fromJS(data: any): OrderGetOutputBillingDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputBillingProvinceto implements IFromJsonConvertable<OrderGetOutputBillingProvinceto> {
  id: string = '';
  description: string = '';

  constructor(data?: any) {
    if (data) {
      this.id = data['id'];
      this.description = data['description'];
    }
  }

  init(data: any): void {
    if (data) {
      this.id = data['id'];
      this.description = data['description'];
    }
  }

  fromJS(data: any): OrderGetOutputBillingProvinceto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
}

export class OrderGetOutputBillingDepartmentDto implements IFromJsonConvertable<OrderGetOutputBillingDepartmentDto> {
  id: string = '';
  description: string = '';

  constructor(data?: any) {
    if (data) {
      this.id = data['id'];
      this.description = data['description'];
    }
  }

  init(data: any): void {
    if (data) {
      this.id = data['id'];
      this.description = data['description'];
    }
  }

  fromJS(data: any): OrderGetOutputBillingDepartmentDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
};

export class OrderGetOutputBillingDistrictDto implements IFromJsonConvertable<OrderGetOutputBillingDistrictDto> {
  id: string = '';
  description: string = '';

  constructor(data?: any) {
    if (data) {
      this.id = data['id'];
      this.description = data['description'];
    }
  }

  init(data: any): void {
    if (data) {
      this.id = data['id'];
      this.description = data['description'];
    }
  }

  fromJS(data: any): OrderGetOutputBillingDistrictDto {
    data = typeof data === 'object' ? data : {};
    this.init(data);
    return this;
  }
};
