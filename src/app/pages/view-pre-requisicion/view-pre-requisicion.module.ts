import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPreRequisicionPageRoutingModule } from './view-pre-requisicion-routing.module';

import { ViewPreRequisicionPage } from './view-pre-requisicion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPreRequisicionPageRoutingModule
  ],
  declarations: [ViewPreRequisicionPage]
})
export class ViewPreRequisicionPageModule {}
