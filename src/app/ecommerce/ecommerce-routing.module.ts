import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcommerceComponent } from './ecommerce.component';

const routes: Routes = [{
  path: '',
  component: EcommerceComponent,
  children: [
    {
      path: 'home',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path: 'categories',
      loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
    },
    {
      path: 'inbox',
      loadChildren: () => import('./inbox/inbox.module').then(m => m.InboxModule)
    },
    {
      path: 'basket',
      loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule)
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
    },
    {
      path: 'scanner',
      loadChildren: () => import('./qr-code-scanner/qr-code-scanner.module').then(m => m.QRCodeScannerModule)
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: 'home',
      pathMatch: 'full'
    },
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceRoutingModule { }
