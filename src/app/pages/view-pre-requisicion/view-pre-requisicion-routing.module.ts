import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPreRequisicionPage } from './view-pre-requisicion.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPreRequisicionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPreRequisicionPageRoutingModule {}
