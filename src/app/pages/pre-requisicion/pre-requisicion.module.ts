import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreRequisicionPageRoutingModule } from './pre-requisicion-routing.module';

import { PreRequisicionPage } from './pre-requisicion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreRequisicionPageRoutingModule
  ],
  declarations: [PreRequisicionPage]
})
export class PreRequisicionPageModule {}
