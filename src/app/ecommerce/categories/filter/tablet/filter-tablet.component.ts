import { Component, Injector, OnInit } from '@angular/core';
import { ViewComponent } from '@geor360/core';

@Component({
  selector: 'app-filter-tablet',
  templateUrl: 'filter-tablet.component.html',
  styleUrls: ['filter-tablet.component.scss'],
  host: { 'app.filter-tablet': 'true' }
})
export class FilterTabletComponent extends ViewComponent implements OnInit {

  showFilterIcon: boolean = true;

  showCategories: boolean = true;
  showColor: boolean = true;
  showPrice: boolean = true;
  showOptions: boolean = true;

  selectedCategoria: string | null = null;
  selectedOption: string | null = null;
  selectedColor: string | null = null;
  selectedPrice: string | null = null;
  hasSelections: boolean = false;

  constructor(_injector: Injector) {
    super(_injector);
  }

  ngOnInit() { }

  categorias = ["Damas", "Caballeros", "Niños", "Categoria 01", "Cocina", "Plásticos"];
  options = ["240 x 100", "250 x 100", "260 x 100", "270 x 100", "280 x 100", "290 x 100"];
  prices = ["Min", "Max"];

  colores = [
    { background: '#62A0E7', selected: false },
    { background: '#F4AB67', selected: false },
    { background: '#57C9BB', selected: false },
    { background: '#FCDE89', selected: false },
  ];


  toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  selectCat(categoria: string) {
    this.selectedCategoria = categoria;
    this.hasSelections = true;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  selectOpt(option: string) {
    this.selectedOption = option;
    this.hasSelections = true;
  }

  toggleColor() {
    this.showColor = !this.showColor;
  }

  selectColor(color: any) {
    this.colores.forEach((c) => (c.selected = false));
    color.selected = true;
    this.selectedColor = color.background;
    this.hasSelections = true;
  }

  togglePrice() {
    this.showPrice = !this.showPrice;
  }

  selectPrice(price: string) {
    this.selectedPrice = price;
    this.hasSelections = true;
  }

  cleanSelectionColor() {
    this.colores.forEach((color) => (color.selected = false));
    this.selectedColor = null;
  }
  clean() {
    this.selectedCategoria = null;
    this.selectedOption = null;
    this.selectedColor = null;
    this.showColor = true;
    this.cleanSelectionColor();
    this.hasSelections = false;
  }

  input(content: any) {
  }

}