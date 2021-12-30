import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { NuevoArticuloPage } from '../modals-pre-requisiciones/nuevo-articulo/nuevo-articulo.page';

@Component({
  selector: 'app-pre-requisicion',
  templateUrl: './pre-requisicion.page.html',
  styleUrls: ['./pre-requisicion.page.scss'],
})
export class PreRequisicionPage implements OnInit {

  fecha: string;
  hora: string;
  imagen: string = "";
  datos: any = {};
  productos: any = [];

  constructor(
    private modalController: ModalController,
    public toastCtrl: ToastController
  ) {
    var d = new Date();
    this.fecha = ("00" + d.getDate()).slice(-2) + "/" + ("00" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    this.hora = ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2);
  }

  ngOnInit() {
  }

  /* Modal para abrir Add Articulos Pre-requisicion */
  async add() {
    /* this.showModal(NuevoArticuloComponent); */
    let modal = await this.modalController.create({
      component: NuevoArticuloPage,
    });
    modal.onDidDismiss().then((data: any) => {
      this.datos = data;
      if (this.datos.data == undefined) {
        console.log("Exit");
        this.datos = {};
      }
      else {
        console.log("Exito", this.datos.data);
        this.productos.push(this.datos.data);
        console.log(this.productos);
      }
    });
    return await modal.present();
  }

}
