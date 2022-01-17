import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewArticuloPageRoutingModule } from './view-articulo-routing.module';

import { ViewArticuloPage } from './view-articulo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewArticuloPageRoutingModule
  ],
  declarations: [ViewArticuloPage]
})
export class ViewArticuloPageModule {}
