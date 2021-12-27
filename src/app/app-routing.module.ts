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
  },  {
    path: 'home-pre-requisiciones',
    loadChildren: () => import('./pages/home-pre-requisiciones/home-pre-requisiciones.module').then( m => m.HomePreRequisicionesPageModule)
  },
  {
    path: 'pre-requisicion',
    loadChildren: () => import('./pages/pre-requisicion/pre-requisicion.module').then( m => m.PreRequisicionPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
