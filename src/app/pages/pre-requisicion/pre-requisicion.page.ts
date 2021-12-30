import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavController } from '@ionic/angular';
import { NuevoArticuloPage } from '../modals-pre-requisiciones/nuevo-articulo/nuevo-articulo.page';

@Component({
  selector: 'app-pre-requisicion',
  templateUrl: './pre-requisicion.page.html',
  styleUrls: ['./pre-requisicion.page.scss'],
})
export class PreRequisicionPage implements OnInit {

  imagen: string = "";
  prueba: any;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  /* Modal para abrir Add Articulos Pre-requisicion */
  async add() {
    /* this.showModal(NuevoArticuloComponent); */
    let modal = await this.modalController.create({
      component: NuevoArticuloPage,
    });
    modal.onDidDismiss().then((data:any) => {
      this.imagen = data;
      console.log(this.imagen);
    });
    return await modal.present();
  }

}
