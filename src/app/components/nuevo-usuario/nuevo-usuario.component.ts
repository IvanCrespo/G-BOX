import { Component, OnInit } from '@angular/core';

import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss'],
})
export class NuevoUsuarioComponent implements OnInit {
  s_name: string;
  s_apellidop: string;
  s_apellidoa: string;
  s_usuario: string;
  email: string;
  password: string;
  s_telefono: number;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.s_name = '';
    this.s_apellidop = '';
    this.s_apellidoa = '';
    this.s_usuario = '';
    this.email = '';
    this.password = '';
  }

  ngOnInit() {}

  async showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create(
      {
        message,
        color,
        duration
      }
    );

    toast.present();
  }

  enviarDatos() {
    this.showToast('Registro completo', 'primary', 3000).then(
      () => {
        this.salirModal();
      }
    );
  }

  salirModal() {
    this.modalController.dismiss();
  }
}