import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePreRequisicionesPage } from './home-pre-requisiciones.page';

const routes: Routes = [
  {
    path: '',
    component: HomePreRequisicionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePreRequisicionesPageRoutingModule {}
