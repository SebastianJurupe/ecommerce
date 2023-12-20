import { Component, ElementRef, HostListener, Injector, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AppTabService, ViewComponent } from '@geor360/core';
import { Router } from '@angular/router';


@Component({
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  host: { 'app.component': 'true' }
})
export class AppComponent extends ViewComponent implements OnInit {



  @ViewChildren('item') items!: QueryList<ElementRef>;

  toolbar: AppTabService;
  sizeScreenWidth: number = 0;
  showMore: boolean = false;


  constructor(_injector: Injector, private router: Router,) {
    super(_injector);
    this.toolbar = _injector.get(AppTabService);
  }


  ionTabsDidChange() {
    const items = Array.from(this.items.toArray().map(el => el.nativeElement)) as HTMLDivElement[];
    const currentRoute = this.router.url;
    this.addActiveClass(items, currentRoute);
  }

  ngOnInit() {
    this.getScreenSize();

  }

  ngOnDestroy(): void {
    localStorage.setItem('isLogged', 'false');
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: Event) {
    this.sizeScreenWidth = window.innerWidth;
    this.changeScreen();
  }

  changeScreen() {
    if (this.sizeScreenWidth < 500) {
      this.showMore = true;
    }
    else {
      this.showMore = false;
    }
  }

  addActiveClass(itemsFooter: HTMLDivElement[], currentRoute: string) {
    itemsFooter.forEach(item => item.classList.remove('active'));
    const active = Object.entries(this.getRoutes()).find(([_key, value]) => value.includes(currentRoute));
    if (active) {
      const [activeIndex, _] = active;
      itemsFooter[+activeIndex]?.classList.add('active');
    }
  }


  navigateToProfile() {
    this.navigation.root('/app/profile/home', 'back');
  }

  getRoutes() {
    return {
      0: ['/app/notifications/welcome'],
      1: ['/app/companies/welcome', '/app/companies/company/elishop'],
      2: ['/app/discover/welcome'],
      3: ['/app/profile/home'],
    };
  }
}
