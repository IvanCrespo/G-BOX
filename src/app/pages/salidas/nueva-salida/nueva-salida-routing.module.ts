import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaSalidaPage } from './nueva-salida.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaSalidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaSalidaPageRoutingModule {}
