import { Component } from '@angular/core';
import {
  NavController,
  LoadingController,
  AlertController,
} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  usuario: any;
  foto: string;

  activePageTitle = 'Pre-requisiciones';

  pages = [
    /* {
      title: 'Dashboard',
      url: '',
      icon: 'albums'
    }, */
    {
      title: 'Pre-requisiciones',
      url: '/home-pre-requisiciones',
      icon: 'cube-outline',
    },
    {
      title: 'Salidas',
      url: '/home-salidas',
      icon: 'paper-plane-outline',
    }
  ];

  constructor(
    private navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
    this.usuario = localStorage.getItem('usuario');
    this.foto = localStorage.getItem('foto');
   }

  async logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot("/login");
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
      duration: 2000,
      message: 'Cerrando sesión...',
      translucent: true,
    });
    return await loading.present();
  }
}
