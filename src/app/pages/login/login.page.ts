import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { LoadingController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

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
  user: string;
  password: string;
  data: any;

  constructor(
    private modalController: ModalController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private loginService: LoginService,
    private loadingCtrl: LoadingController,
    public menuCtrl: MenuController
  ) {
    this.user = '';
    this.password = '';
  }

  ngOnInit() { }

  /* Mostrar Modales */
  async showModal(component) {
    const modal = await this.modalController.create(
      {
        component
      }
    );
    modal.present();
  }

  /* Mostrar Mensaje Toast */
  async presentToast(message: string, color: string, duration: number) {
    const toast = await this.toastCtrl.create(
      {
        message,
        color,
        duration
      }
    );
    toast.present();
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
      duration: 3000
    });

    this.loginService.login(this.user, this.password)
      .subscribe(data => {
        this.data = data;
        console.log(this.data);
        if (this.data.status == "success") {
          localStorage.setItem("id_usuario", this.data.data.id_usuario);
          localStorage.setItem("s_token", this.data.data.s_token);
          localStorage.setItem("usuario", this.data.data.s_nombre + " " + this.data.data.s_paterno + " " + this.data.data.s_materno);
          localStorage.setItem("empresa", this.data.data.empresa.s_empresa);
          this.navCtrl.navigateRoot("/home-pre-requisiciones");
          loading.dismiss();
          this.presentToast(this.data.message, this.data.status, 3000);
        } else {
          loading.dismiss();
          this.presentToast(this.data.message, this.data.status, 3000);
        }
      });
  }

  resetPassword() {
    this.showModal(ForgotPasswordComponent);
  }

  newUser() {
    this.showModal(NuevoUsuarioComponent);
  }

  ionViewDidEnter() {
    // El menú de la raíz izquierda debe estar deshabilitado en esta página
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // Habilita el menú raíz izquierdo al salir de esta página
    this.menuCtrl.enable(true);
  }
}
