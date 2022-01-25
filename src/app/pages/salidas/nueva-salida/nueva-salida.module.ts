import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaSalidaPageRoutingModule } from './nueva-salida-routing.module';

import { NuevaSalidaPage } from './nueva-salida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaSalidaPageRoutingModule
  ],
  declarations: [NuevaSalidaPage]
})
export class NuevaSalidaPageModule {}
