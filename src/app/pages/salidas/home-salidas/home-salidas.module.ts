import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeSalidasPageRoutingModule } from './home-salidas-routing.module';

import { HomeSalidasPage } from './home-salidas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeSalidasPageRoutingModule
  ],
  declarations: [HomeSalidasPage]
})
export class HomeSalidasPageModule {}
