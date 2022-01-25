import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeSalidasPage } from './home-salidas.page';

const routes: Routes = [
  {
    path: '',
    component: HomeSalidasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeSalidasPageRoutingModule {}
