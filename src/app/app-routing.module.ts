import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'preview',
    loadChildren: () => import('./preview/preview.module').then( m => m.PreviewPageModule)
  },
  {
    path: 'ecommerce',
    loadChildren: () => import('./ecommerce/ecommerce.module').then( m => m.EcommerceModule)
  },
  {
    path: '',
    redirectTo: 'ecommerce',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'ecommerce',
    pathMatch: 'full'
  },
];

@NgModule({
  imports:
 [RouterModule.forChild(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
