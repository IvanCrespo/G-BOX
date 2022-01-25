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
      url: '',
      icon: 'paper-plane-outline',
    },
    {
      title: 'Salir',
      url: '',
      icon: 'log-out-outline',
    }
  ];

  constructor(
    private navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) { }

/*   async logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot("/login");
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
      duration: 2000,
      message: 'Cerrando sesión...',
      translucent: true,
    });
    return await loading.present();
  } */

  async openPage(pages) {
    if (pages.title == 'Salir') {
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

}
