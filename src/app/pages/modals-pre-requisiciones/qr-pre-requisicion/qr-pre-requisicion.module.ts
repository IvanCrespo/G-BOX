import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrPreRequisicionPageRoutingModule } from './qr-pre-requisicion-routing.module';

import { QrPreRequisicionPage } from './qr-pre-requisicion.page';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    NgxQRCodeModule,
    FormsModule,
    IonicModule,
    QrPreRequisicionPageRoutingModule
  ],
  declarations: [QrPreRequisicionPage]
})
export class QrPreRequisicionPageModule {}
