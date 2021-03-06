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
        if (!this.isNotErrorApiResponse(this.data)) {
          this.presentToast(this.data.message, "danger", 2500);
          return false;
        }
        else if (this.data.status == "success") {
          localStorage.setItem("id_usuario", this.data.data.id_usuario);
          localStorage.setItem("s_token", this.data.data.s_token);
          localStorage.setItem("usuario", this.data.data.s_nombre + " " + this.data.data.s_paterno + " " + this.data.data.s_materno);
          localStorage.setItem("empresa", this.data.data.empresa.s_empresa);
          localStorage.setItem("foto", this.data.data.foto);
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
    // El men?? de la ra??z izquierda debe estar deshabilitado en esta p??gina
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // Habilita el men?? ra??z izquierdo al salir de esta p??gina
    this.menuCtrl.enable(true);
  }

  /* Errores APIS Status */
  isNotErrorApiResponse(response: any): boolean {
    if (response.status == 'empty') return false;
    if (response.status == 'fail') return false;
    if (response.status == 'logout') {
      localStorage.clear();
      this.navCtrl.navigateRoot("/login");
      return false;
    }
    return true;
  }
}
