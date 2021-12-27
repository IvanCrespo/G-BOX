import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreRequisicionPage } from './pre-requisicion.page';

const routes: Routes = [
  {
    path: '',
    component: PreRequisicionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreRequisicionPageRoutingModule {}
