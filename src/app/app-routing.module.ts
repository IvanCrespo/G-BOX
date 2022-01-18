import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home-pre-requisiciones',
    loadChildren: () => import('./pages/home-pre-requisiciones/home-pre-requisiciones.module').then( m => m.HomePreRequisicionesPageModule)
  },
  {
    path: 'pre-requisicion',
    loadChildren: () => import('./pages/pre-requisicion/pre-requisicion.module').then( m => m.PreRequisicionPageModule)
  },
  {
    path: 'nuevo-articulo',
    loadChildren: () => import('./pages/modals-pre-requisiciones/nuevo-articulo/nuevo-articulo.module').then( m => m.NuevoArticuloPageModule)
  },  {
    path: 'view-pre-requisicion',
    loadChildren: () => import('./pages/view-pre-requisicion/view-pre-requisicion.module').then( m => m.ViewPreRequisicionPageModule)
  },
  {
    path: 'view-articulo',
    loadChildren: () => import('./pages/modals-pre-requisiciones/view-articulo/view-articulo.module').then( m => m.ViewArticuloPageModule)
  },
  {
    path: 'qr-pre-requisicion',
    loadChildren: () => import('./pages/modals-pre-requisiciones/qr-pre-requisicion/qr-pre-requisicion.module').then( m => m.QrPreRequisicionPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
