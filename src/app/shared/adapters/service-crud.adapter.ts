

export interface ServiceCrudAdapter {
  getAll(): Promise<boolean>;
  getById(id: number): any;
  deleteById(id: number): Promise<boolean>;
}