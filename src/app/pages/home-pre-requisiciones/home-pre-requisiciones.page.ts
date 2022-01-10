import { Component, OnInit } from '@angular/core';
import {
  NavController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-home-pre-requisiciones',
  templateUrl: './home-pre-requisiciones.page.html',
  styleUrls: ['./home-pre-requisiciones.page.scss'],
})
export class HomePreRequisicionesPage implements OnInit {
  /* URL Services */
  private url = 'pre_requisicion';

  /* Data LocalStorage */
  token: any;

  /* Datos de Pre-requisiciones */
  pre_requisiciones: any = [];

  constructor(
    private navCtrl: NavController,
    private inventarioServ: InventariosService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.token = localStorage.getItem('s_token');
    this.cargaRegistros();
  }

  ngOnInit() {}

  async cargaRegistros() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
      duration: 2000,
    });
    this.inventarioServ.Get(this.token, this.url).subscribe((data: any) => {
      this.pre_requisiciones = data.data.pre_requisicion;
      console.log(this.pre_requisiciones);
      if (data.status == 'fail') {
        this.presentAlert(data.title, data.message);
        loading.dismiss();
      } else if (data.status == 'success') {
        loading.dismiss();
      }
    });
    loading.present();
  }

  add() {
    this.navCtrl.navigateForward(['/pre-requisicion']);
  }

  async presentAlert(titulo, mensaje) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
