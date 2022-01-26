import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import {
  ModalController, NavParams
} from '@ionic/angular';
import { NuevoProductoPage } from '../modals-salidas/nuevo-producto/nuevo-producto.page';

@Component({
  selector: 'app-nueva-salida',
  templateUrl: './nueva-salida.page.html',
  styleUrls: ['./nueva-salida.page.scss'],
})
export class NuevaSalidaPage implements OnInit {

  // Data de Pre-requisicion --> Home Salidas
  public value = this.navParams.get('prerequisicion');

  /* Datos de Formulario */
  s_folio: string;
  s_empresa: string;
  estatus: any;
  usuario_solicitante: any;
  d_fecha_estimada_entrega: any;
  datos: any = {};
  productos: any = [];
  artSalidas: any = [];

  /* Disabled */
  isReadonly: boolean = true;
  btnArtSalida: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.s_folio = this.value.s_folio;
    this.s_empresa = this.value.empresa.s_empresa;
    this.estatus = this.value.estatus_pre_requisicion.s_estatus;
    this.usuario_solicitante = this.value.usuario_solicitante.s_nombre + ' ' + this.value.usuario_solicitante.s_paterno + ' ' + this.value.usuario_solicitante.s_materno;
    this.d_fecha_estimada_entrega = this.value.d_fecha_estimada_entrega;
    this.productos = this.value.pre_requisiciones_productos;
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }


  /* Modal para abrir Nuevo Producto */
  async add() {
    let modal = await this.modalCtrl.create({
      component: NuevoProductoPage,
    });
    modal.onDidDismiss().then((data: any) => {
      this.datos = data;
      console.log(this.datos);
    });
    return await modal.present();
  }

}
