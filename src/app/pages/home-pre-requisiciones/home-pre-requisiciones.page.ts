import { Component, OnInit } from '@angular/core';
import {
  NavController,
  LoadingController,
  AlertController, ToastController
} from '@ionic/angular';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-home-pre-requisiciones',
  templateUrl: './home-pre-requisiciones.page.html',
  styleUrls: ['./home-pre-requisiciones.page.scss'],
})
export class HomePreRequisicionesPage implements OnInit {

  /* Pagination */
  page: number = 1;

  /* URL Services */
  private url = 'pre_requisicion';

  /* Data LocalStorage */
  token: any;

  /* Datos de Pre-requisiciones */
  pre_requisiciones: any = [];
  id_estatus_pre_requisicion: any;
  status: any;
  pre_requisicionesReverse: any = [];

  constructor(
    private navCtrl: NavController,
    private inventarioServ: InventariosService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController
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
      this.pre_requisicionesReverse = data.data.pre_requisicion;
      this.pre_requisicionesReverse.reverse();
      this.pre_requisiciones = this.pre_requisicionesReverse;
      if (!this.isNotErrorApiResponse(data)) {
        this.presentToast(data.message, "danger", 2500);
        return false;
      }
      else if (data.status == 'fail') {
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

  view(registro){
    let selected = { state: { registro: registro } };
    this.navCtrl.navigateForward(["/view-pre-requisicion"], selected);
  }

  async presentAlert(titulo, mensaje) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
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
}
