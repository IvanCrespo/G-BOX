import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePreRequisicionesPageRoutingModule } from './home-pre-requisiciones-routing.module';

import { HomePreRequisicionesPage } from './home-pre-requisiciones.page';
	
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePreRequisicionesPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [HomePreRequisicionesPage]
})
export class HomePreRequisicionesPageModule {}
