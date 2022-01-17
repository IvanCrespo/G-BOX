import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewArticuloPage } from './view-articulo.page';

const routes: Routes = [
  {
    path: '',
    component: ViewArticuloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewArticuloPageRoutingModule {}
