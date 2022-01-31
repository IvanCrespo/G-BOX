import { Component, OnInit } from '@angular/core';
import {
  ModalController, NavParams, ToastController, LoadingController, NavController
} from '@ionic/angular';
import { NuevoProductoPage } from '../modals-salidas/nuevo-producto/nuevo-producto.page';
import { InventariosService } from 'src/app/services/inventarios.service';
/* Plugins */
import {
  Geolocation,
  Geoposition,
} from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-nueva-salida',
  templateUrl: './nueva-salida.page.html',
  styleUrls: ['./nueva-salida.page.scss'],
})
export class NuevaSalidaPage implements OnInit {

  // Data de Pre-requisicion --> Home Salidas
  public value = this.navParams.get('prerequisicion');
  public valueSin = this.navParams.get('sinprerequisicion');

  /* URL Services */
  private url = 'salidas';

  /* Data LocalStorage */
  token: any;

  /* Datos de Formulario */
  s_folio: string;
  s_empresa: string;
  estatus: any;
  usuario_solicitante: any;
  d_fecha_estimada_entrega: any;
  datos: any = {};
  productos: any = [];
  artSalidas: any = [];
  salidaEdit: any = [];
  d_fecha: string;
  t_hora: string;
  id_pre_requisicion: number;
  id_usuario_solicitante: number;
  lat: number;
  lon: number;

  /* Sin Pre-requisicion */
  fechaHoy: any;
  usuario: any;
  s_nota: any;
  personasRecibe: any;
  id_talento_humano: any;

  /* Disabled */
  isReadonly: boolean = true;
  btnArtSalida: boolean = false;
  activatePre_requisicion: boolean;
  b_pre_requisicion: any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private inventarioServ: InventariosService,
    private navCtrl: NavController,
    private geolocation: Geolocation
  ) {
    this.getGeolocation();
    var d = new Date();
    this.d_fecha = d.getFullYear() + '-' + ('00' + (d.getMonth() + 1)).slice(-2) + '-' + ('00' + d.getDate()).slice(-2);
    this.t_hora =
      ('00' + d.getHours()).slice(-2) +
      ':' +
      ('00' + d.getMinutes()).slice(-2) +
      ':' +
      ('00' + d.getSeconds()).slice(-2);

    this.token = localStorage.getItem('s_token');
    if (this.value) {
      this.b_pre_requisicion = 0;
      this.id_pre_requisicion = this.value.id_pre_requisicion;
      this.id_usuario_solicitante = this.value.id_usuario_solicitante;
      this.s_folio = this.value.s_folio;
      this.s_empresa = this.value.empresa.s_empresa;
      this.estatus = this.value.estatus_pre_requisicion.s_estatus;
      this.usuario_solicitante = this.value.usuario_solicitante.s_nombre + ' ' + this.value.usuario_solicitante.s_paterno + ' ' + this.value.usuario_solicitante.s_materno;
      this.d_fecha_estimada_entrega = this.value.d_fecha_estimada_entrega;
      this.productos = this.value.pre_requisiciones_productos;
      this.activatePre_requisicion = true;
    }
    else if (this.valueSin) {
      this.b_pre_requisicion = 1;
      this.id_usuario_solicitante = this.valueSin.id_usuario;
      this.s_empresa = this.valueSin.empresa;
      this.activatePre_requisicion = false;
      this.fechaHoy = this.d_fecha + ' - ' + this.t_hora;
      this.usuario = this.valueSin.usuario;
    }
    this.cargaRegistros();
  }

  ngOnInit() {
    this.getUsuarios();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  /* Modal para abrir Nuevo Producto */
  async add() {
    let productos = this.artSalidas;
    let modal = await this.modalCtrl.create({
      component: NuevoProductoPage,
      componentProps: { productos: productos }
    });
    modal.onDidDismiss().then((data: any) => {
      this.datos = data;
      if (this.datos.data == undefined) {
        if (this.artSalidas.length == 0) {
          this.btnArtSalida = false;
        } else {
          this.btnArtSalida = true;
        }
        this.datos = {};
      } else {
        this.btnArtSalida = true;
        this.artSalidas.push(this.datos.data);
        console.log(this.artSalidas);
      }
    });
    return await modal.present();
  }

  /* Modal Edit */
  async modalProducto(index: number) {
    this.salidaEdit = this.artSalidas[index];
    const modalEdit = await this.modalCtrl.create({
      component: NuevoProductoPage,
      componentProps: { productoSalida: this.salidaEdit, index: 1 }
    });
    modalEdit.onDidDismiss().then((data: any) => {
      this.datos = data.data;
      console.log(this.datos);
      if (this.datos == undefined) {
        if (this.artSalidas.length == 0) {
          this.btnArtSalida = false;
        } else {
          this.btnArtSalida = true;
        }
        this.datos = {};
      } else {
        let update_producto = {
          id_producto: 0,
          n_cantidad: 0,
          n_cantidad_anterior: 0,
          n_cantidad_nueva: 0,
          s_codigo_producto: "",
          s_producto: "",
          s_unidad_medida: ""
        };
        update_producto.id_producto = this.datos.id_producto;
        update_producto.n_cantidad = this.datos.n_cantidad;
        update_producto.n_cantidad_anterior = this.datos.n_cantidad_anterior;
        update_producto.n_cantidad_nueva = this.datos.n_cantidad_nueva;
        update_producto.s_codigo_producto = this.datos.s_codigo_producto;
        update_producto.s_producto = this.datos.s_producto;
        update_producto.s_unidad_medida = this.datos.s_unidad_medida;
        this.artSalidas.splice(index, 1, update_producto);
      }
    });
    return await modalEdit.present();
  }

  async save() {
    if (this.artSalidas.length == 0) {
      this.presentToast(`No tiene ningun producto agregado para crear una nueva Salida`, "warning", 2500);
    }
    else {
      this.datos = {
        id_usuario_recibe: this.id_usuario_solicitante,
        id_usuario_solicita: this.id_usuario_solicitante,
        d_fecha: this.d_fecha,
        t_hora: this.t_hora,
        id_pre_requisicion: this.id_pre_requisicion,
        latitud: this.lat,
        longitud: this.lon,
        b_pre_requisicion: this.b_pre_requisicion,
        b_es_movil: 1,
        b_activo: 1,
        productos: this.artSalidas
      };
      const loading = await this.loadingCtrl.create({
        message: 'Espere un momento...'
      });
      await loading.present();
      this.inventarioServ
        .Post(this.token, this.url, this.datos)
        .subscribe((data: any) => {
          if (!this.isNotErrorApiResponse(data)) {
            this.presentToast(data.message, "danger", 2500);
            return false;
          }
          else if (data.status == 'fail') {
            this.presentToast(`Error al ingresar Nueva Salida`, "danger", 2500);
            loading.dismiss();
          } else if (data.status == 'success') {
            this.presentToast(`Nueva Salida exitosa`, "success", 2500);
            this.navCtrl.navigateRoot('/home-salidas');
            loading.dismiss();
          }
        });
    }
  }

  async saveSinPrerequisicion() {
    if (this.artSalidas.length == 0) {
      this.presentToast(`No tiene ningun producto agregado para crear una nueva Salida`, "warning", 2500);
    }
    else if (this.id_talento_humano == null || this.id_talento_humano == undefined) {
      this.presentToast(`Campo Persona que Recibe no debe estar vacio`, "warning", 2500);
    }
    else if (this.s_nota == null || this.s_nota == undefined) {
      this.presentToast(`Campo Nota no debe estar vacio`, "warning", 2500);
    }
    else {
      this.datos = {
        id_usuario_recibe: this.id_talento_humano,
        id_usuario_solicita: this.id_usuario_solicitante,
        d_fecha: this.d_fecha,
        t_hora: this.t_hora,
        id_pre_requisicion: this.id_pre_requisicion,
        latitud: this.lat,
        longitud: this.lon,
        b_pre_requisicion: this.b_pre_requisicion,
        s_nota: this.s_nota,
        b_es_movil: 1,
        b_activo: 1,
        productos: this.artSalidas
      };
      const loading = await this.loadingCtrl.create({
        message: 'Espere un momento...'
      });
      await loading.present();
      this.inventarioServ
        .Post(this.token, this.url, this.datos)
        .subscribe((data: any) => {
          if (!this.isNotErrorApiResponse(data)) {
            this.presentToast(data.message, "danger", 2500);
            return false;
          }
          else if (data.status == 'fail') {
            this.presentToast(`Error al ingresar Nueva Salida`, "danger", 2500);
            loading.dismiss();
          }
          else if (data.status == 'success') {
            this.presentToast(`Nueva Salida exitosa`, "success", 2500);
            this.navCtrl.navigateRoot('/home-salidas');
            loading.dismiss();
          }
        });
    }
  }

  deleteProducto(id: number) {
    this.artSalidas.splice(id, 1);
    if (this.artSalidas.length == 0) {
      this.btnArtSalida = false;
    }
    else this.btnArtSalida = true;
  }

  /* Geolocalización */
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
    });
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

  // catalogos 
  getUsuarios() {
    this.inventarioServ.GetAll(this.token, 'talentos_humanos').subscribe(
      (res: any) => {

        if (!this.isNotErrorApiResponse(res)) {
          this.presentToast(res.message, "danger", 2500);
          return false;
        }
        this.personasRecibe = res.data.talentos_humanos.data;
      }, (err => console.log(err))
    ), (err => console.log(err))
  }

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

  /* Checar Salidas */
  async cargaRegistros() {
    this.inventarioServ.GetAll(this.token, this.url).subscribe((data: any) => {
      console.log(data);
    });
  }

}
