import { Component, OnInit } from '@angular/core';

import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  email: string;
  codigo: number;
  bandCodigo: boolean;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.email = '';
    this.bandCodigo = false;
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

  sendEmail() {
    this.showToast('Código enviado al correo', 'secondary', 3000).then(
      () => {
        this.bandCodigo = true;
      }
    );
  }

  sendCodigo() {
    this.showToast('Código correcto', 'secondary', 3000).then(
      () => {
        this.backModal();
      }
    );
  }

  backModal() {
    this.modalController.dismiss();
  }
}
