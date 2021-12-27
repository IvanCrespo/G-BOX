import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

/**
 * Componentes
 */
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { HeaderBackComponent } from './header-back/header-back.component';



@NgModule({
  declarations: [
    HeaderBackComponent,
    ForgotPasswordComponent,
    NuevoUsuarioComponent
  ],
  exports: [
    HeaderBackComponent,
    ForgotPasswordComponent,
    NuevoUsuarioComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class ComponentsModule { }
