import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrPreRequisicionPageRoutingModule } from './qr-pre-requisicion-routing.module';

import { QrPreRequisicionPage } from './qr-pre-requisicion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrPreRequisicionPageRoutingModule
  ],
  declarations: [QrPreRequisicionPage]
})
export class QrPreRequisicionPageModule {}
