import { Component, OnInit } from '@angular/core';

import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss'],
})
export class NuevoUsuarioComponent implements OnInit {
  s_nombre: string;
  s_paterno: string;
  s_materno: string;
  s_usuario: string;
  email: string;
  password: string;
  s_telefono: number;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.s_nombre = '';
    this.s_paterno = '';
    this.s_materno = '';
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

  signin() {
    this.showToast('Registro completo', 'primary', 3000).then(
      () => {
        this.backModal();
      }
    );
  }

  backModal() {
    this.modalController.dismiss();
  }
}