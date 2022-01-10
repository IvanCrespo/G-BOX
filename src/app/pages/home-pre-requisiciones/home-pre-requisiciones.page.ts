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
  id_estatus_pre_requisicion: any;
  status: any;

  constructor(
    private navCtrl: NavController,
    private inventarioServ: InventariosService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.token = localStorage.getItem('s_token');
    this.ionViewWillEnter();
  }

  ngOnInit() {}

  ionViewWillEnter(){
    this.cargaRegistros();
   }

  async cargaRegistros() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
      duration: 2000,
    });
    this.inventarioServ.GetAll(this.token, this.url).subscribe((data: any) => {
      this.pre_requisiciones = data.data.pre_requisicion;
      if (data.status == 'fail') {
        this.presentAlert(data.title, data.message);
        loading.dismiss();
      } else if (data.status == 'success') {
        if(this.pre_requisiciones.id_estatus_pre_requisicion == 1){
          this.status = 'Pendiente';
        }
        else if(this.pre_requisiciones.id_estatus_pre_requisicion == 2){
          this.status = 'Autorizado';
        }
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
