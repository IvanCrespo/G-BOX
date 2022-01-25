import { Component, OnInit } from '@angular/core';
import {
  ModalController
} from '@ionic/angular';
import { NuevoProductoPage } from '../modals-salidas/nuevo-producto/nuevo-producto.page';

@Component({
  selector: 'app-nueva-salida',
  templateUrl: './nueva-salida.page.html',
  styleUrls: ['./nueva-salida.page.scss'],
})
export class NuevaSalidaPage implements OnInit {

  /* Datos de Formulario */
  s_folio: string = '------';
  s_empresa: string = 'Cajinsa';
  estatus: any = 'Pendiente';
  datos: any = {};

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  /* Modal para abrir Nuevo Producto */
  async add() {
    /* this.showModal(NuevoArticuloComponent); */
    let modal = await this.modalController.create({
      component: NuevoProductoPage,
    });
    modal.onDidDismiss().then((data: any) => {
      this.datos = data;
      console.log(this.datos);
    });
    return await modal.present();
  }

}
