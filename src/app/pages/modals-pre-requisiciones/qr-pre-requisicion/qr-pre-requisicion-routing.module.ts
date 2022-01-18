import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrPreRequisicionPage } from './qr-pre-requisicion.page';

const routes: Routes = [
  {
    path: '',
    component: QrPreRequisicionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrPreRequisicionPageRoutingModule {}
