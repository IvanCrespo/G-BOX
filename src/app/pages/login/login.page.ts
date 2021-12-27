import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavController } from '@ionic/angular';

/**
 * Components
 */
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { NuevoUsuarioComponent } from '../../components/nuevo-usuario/nuevo-usuario.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: string;
  password: string;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private navController: NavController
  ) {
    this.usuario = '';
    this.password = '';
  }

  ngOnInit() { }

  async showModal(component) {
    const modal = await this.modalController.create(
      {
        component
      }
    );
    modal.present();
  }

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

  /* login() {
    this.showToast('Contraseña correcta', 'secondary', 3000);
  } */

  login() {
    this.navController.navigateForward(['/home-pre-requisiciones']);
  }

  resetPassword() {
    this.showModal(ForgotPasswordComponent);
  }

  newUser() {
    this.showModal(NuevoUsuarioComponent);
  }
}
