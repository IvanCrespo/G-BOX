import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewArticuloPage } from '../modals-pre-requisiciones/view-articulo/view-articulo.page';
import { QrPreRequisicionPage } from '../modals-pre-requisiciones/qr-pre-requisicion/qr-pre-requisicion.page';
import { InventariosService } from 'src/app/services/inventarios.service';
import {
  ModalController,
  ToastController, NavController
} from '@ionic/angular';

@Component({
  selector: 'app-view-pre-requisicion',
  templateUrl: './view-pre-requisicion.page.html',
  styleUrls: ['./view-pre-requisicion.page.scss'],
})
export class ViewPreRequisicionPage implements OnInit {

  /* URL Services */
  private url = 'pre_requisicion';
  private urlprioridad = 'prioridades';
  private urlestatuspre_requisicion = 'estatus_pre_requisicion';

  /* Disable */
  isDisabled: boolean = false;

  /* Data LocalStorage */
  token: any;

  /* Datos de Formulario */
  id_usuario: any;
  s_folio: string;
  s_empresa: string;
  estatus: any;
  id_estatus_pre_requisicion: any;
  usuario_solicitante: any;
  d_fecha_estimada_entrega: any;
  s_nota_pre_requisicion: any;
  productos: any = [];
  producto: any = [];
  datos: any = {};
  n_prioridad: any;
  id_prioridad: number;

  /* Datos de Click View */
  view: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    public toastCtrl: ToastController,
    private inventarioServ: InventariosService,
    private navCtrl: NavController
  ) {
    /* Data de click View */
    this.activatedRoute.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.view = this.router.getCurrentNavigation().extras.state;
        console.log(this.view);
        this.s_folio = this.view.registro.s_folio;
        this.s_empresa = this.view.registro.empresa.s_empresa;
        this.id_estatus_pre_requisicion = this.view.registro.id_estatus_pre_requisicion;
        this.usuario_solicitante = this.view.registro.usuario_solicitante.s_nombre + ' ' +
          this.view.registro.usuario_solicitante.s_paterno + ' ' + this.view.registro.usuario_solicitante.s_materno;
        this.d_fecha_estimada_entrega = this.view.registro.d_fecha_estimada_entrega;
        this.s_nota_pre_requisicion = this.view.registro.s_nota_pre_requisicion;
        this.id_prioridad = this.view.registro.n_prioridad;
        this.token = localStorage.getItem('s_token');
        this.productos = this.view.registro.pre_requisiciones_productos;
        this.isDisabled = true;
        this.verificarEstatusPre_requisicion();
        this.verificarPrioridad();
      }
    });
  }

  ngOnInit() {
  }

  verificarPrioridad() {
    this.inventarioServ.AllById(this.token, this.urlprioridad, this.id_prioridad).subscribe((data: any) => {
      if (!this.isNotErrorApiResponse(data)) {
        this.presentToast(data.message, "danger", 2500);
        return false;
      }
      else {
        this.n_prioridad = data.data.prioridad.s_prioridad;
      }
    });
  }

  verificarEstatusPre_requisicion() {
    this.inventarioServ.AllById(this.token, this.urlestatuspre_requisicion, this.id_estatus_pre_requisicion).subscribe((data: any) => {
      if (!this.isNotErrorApiResponse(data)) {
        this.presentToast(data.message, "danger", 2500);
        return false;
      }
      else {
        this.estatus = data.data.estatus.s_estatus;
      }
    });
  }

  async modalProducto(id_pre_requisicion_productos: number, index: number) {
    this.producto = this.productos.filter((idx) => idx.id_pre_requisicion_productos == id_pre_requisicion_productos);
    let product = this.producto[0];
    const producto_index = this.productos[index];
    const modal = await this.modalController.create({
      component: ViewArticuloPage,
      componentProps: { producto: product, index: 2 }
    });
    modal.onDidDismiss().then((data: any) => {
      this.datos = data;
      if (this.datos.data == undefined) {
        this.datos = {};
      } else {
        producto_index.n_cantidad = this.datos.data.n_cantidad;
        producto_index.s_descripcion_producto = this.datos.data.s_descripcion_producto;
        producto_index.s_foto = this.datos.data.s_foto;
        producto_index.s_orden_mantenimiento = this.datos.data.s_orden_mantenimiento;
        console.log(producto_index);
      }
    });
    return await modal.present();
  }

  async qr() {
    const modal = await this.modalController.create({
      component: QrPreRequisicionPage,
      componentProps: { folio: this.s_folio, fecha: this.d_fecha_estimada_entrega }
    });
    return await modal.present();
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


  /* edit() {
    if (this.id_estatus_pre_requisicion == 1) {
      this.isDisabled = false;
      this.presentToast('Modo Editable');
    }
    else if (this.id_estatus_pre_requisicion == 2 || this.id_estatus_pre_requisicion == 3 || this.id_estatus_pre_requisicion == 4 || this.id_estatus_pre_requisicion == 5 ) {
      this.presentToast('La pre-requisici??n debe estar en Pendiente');
    }
  } */

  /* async presentToast(mensaje) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
    });
    await toast.present();
  } */

}
