import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
  NavController,
} from '@ionic/angular';
import { NuevoArticuloPage } from '../modals-pre-requisiciones/nuevo-articulo/nuevo-articulo.page';
import { InventariosService } from 'src/app/services/inventarios.service';
import { ViewArticuloPage } from '../modals-pre-requisiciones/view-articulo/view-articulo.page';

/* Plugins */
import {
  Geolocation,
  Geoposition,
} from '@awesome-cordova-plugins/geolocation/ngx';
import { importType } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-pre-requisicion',
  templateUrl: './pre-requisicion.page.html',
  styleUrls: ['./pre-requisicion.page.scss'],
})
export class PreRequisicionPage implements OnInit {
  /* Actived Btn Articulos */
  btnAddArticulos: boolean = false;

  /* URL Services */
  private url = 'pre_requisicion';

  /* Data LocalStorage */
  token: any;

  /* Datos de Formulario */
  id_usuario: any;
  s_folio: string = '------';
  s_empresa: string;
  estatus: any;
  usuario_solicitante: any;
  d_fecha_estimada_entrega: any;
  s_nota_pre_requisicion: any;
  lat: number;
  lon: number;
  d_fecha: string;
  t_hora: string;
  post: any = {};
  datos: any = {};
  productos: any = [];
  producto: any = [];

  constructor(
    private modalController: ModalController,
    public toastCtrl: ToastController,
    private geolocation: Geolocation,
    private inventarioServ: InventariosService,
    private navCtrl: NavController
  ) {
    var d = new Date();
    this.d_fecha = d.getFullYear() + '-' + ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2);
    this.t_hora =
      ('00' + d.getHours()).slice(-2) +
      ':' +
      ('00' + d.getMinutes()).slice(-2) +
      ':' +
      ('00' + d.getSeconds()).slice(-2);
    this.getGeolocation();
    this.s_empresa = localStorage.getItem('empresa');
    this.id_usuario = localStorage.getItem('id_usuario');
    this.token = localStorage.getItem('s_token');
    this.usuario_solicitante = localStorage.getItem('usuario');
    this.getAddData();
  }

  ngOnInit() { }

  getAddData() {
    let estatus_actual: any = 1;
    if (estatus_actual == 1) {
      this.estatus = 'Pendiente';
    }
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
        if (this.productos.length == 0) {
          this.btnAddArticulos = false;
        } else {
          this.btnAddArticulos = true;
        }
        this.datos = {};
      } else {
        this.btnAddArticulos = true;
        this.productos.push(this.datos.data);
        console.log(this.productos);
      }
    });
    return await modal.present();
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
    });
  }

  save() {
    var dateFormat = this.d_fecha_estimada_entrega.split('T')[0];
    this.datos = {
      d_fecha: this.d_fecha,
      t_hora: this.t_hora,
      id_usuario_solicitante: this.id_usuario,
      id_usuario_elaboro: this.id_usuario,
      s_nota_pre_requisicion: this.s_nota_pre_requisicion,
      b_transferido: '0',
      d_fecha_estimada_entrega: dateFormat,
      latitud: this.lat,
      longitud: this.lon,
      n_prioridad: '1',
      b_es_movil: '1',
      b_activo: '1',
      productos: this.productos,
    };
    console.log(this.datos);
    if (
      this.datos.s_nota_pre_requisicion == '' ||
      this.datos.s_nota_pre_requisicion == undefined
    ) {
      this.presentToast('Campo Nota vacio');
    } else {
      this.inventarioServ
        .Post(this.token, this.url, this.datos)
        .subscribe((data: any) => {
          console.log(data);
          if (data.status == 'fail') {
            this.presentToast('Error al ingresar Pre-requisición');
          } else if (data.status == 'success') {
            this.presentToast('Pre-requisición exitosa');
            this.navCtrl.navigateRoot('/home-pre-requisiciones');
          }
        });
    }
  }

  async modalProducto(index: number) {
    this.producto = this.productos[index];
    const modal = await this.modalController.create({
      component: ViewArticuloPage,
      componentProps: { producto: this.producto }
    });
    modal.onDidDismiss().then((data: any) => {
      this.datos = data;
      if (this.datos.data == undefined) {
        if (this.productos.length == 0) {
          this.btnAddArticulos = false;
        } else {
          this.btnAddArticulos = true;
        }
        this.datos = {};
      } else {
        let update_producto = {
          n_cantidad: 0,
          s_descripcion_producto: "",
          s_orden_mantenimiento: "",
          s_foto: ""
        };
        update_producto.n_cantidad = this.datos.data.n_cantidad;
        update_producto.s_descripcion_producto = this.datos.data.s_descripcion_producto;
        update_producto.s_orden_mantenimiento = this.datos.data.s_orden_mantenimiento;
        update_producto.s_foto = this.datos.data.s_foto;
        this.productos.splice(index, 1, update_producto);
      }
    });
    return await modal.present();
  }

  async presentToast(mensaje) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
    });
    await toast.present();
  }
}
