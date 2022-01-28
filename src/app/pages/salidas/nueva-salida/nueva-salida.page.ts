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
  d_fecha: string;
  t_hora: string;
  id_pre_requisicion: number;
  id_usuario_solicitante: number;
  lat: number;
  lon: number;

  /* Disabled */
  isReadonly: boolean = true;
  btnArtSalida: boolean = false;
  activatePre_requisicion: boolean;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private inventarioServ: InventariosService,
    private navCtrl: NavController,
    private geolocation: Geolocation
  ) {
    if (this.value) {
      console.log("Entra", this.value);
      this.id_pre_requisicion = this.value.id_pre_requisicion;
      this.id_usuario_solicitante = this.value.id_usuario_solicitante
      this.s_folio = this.value.s_folio;
      this.s_empresa = this.value.empresa.s_empresa;
      this.estatus = this.value.estatus_pre_requisicion.s_estatus;
      this.usuario_solicitante = this.value.usuario_solicitante.s_nombre + ' ' + this.value.usuario_solicitante.s_paterno + ' ' + this.value.usuario_solicitante.s_materno;
      this.d_fecha_estimada_entrega = this.value.d_fecha_estimada_entrega;
      this.productos = this.value.pre_requisiciones_productos;
      this.activatePre_requisicion == true;
    }
    else if(this.valueSin){
      console.log("Sin Pre-requisición");
      this.activatePre_requisicion == false;
    }
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
    /* this.cargaRegistros(); */
  }

  ngOnInit() {
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
        b_pre_requisicion: 0,
        b_es_movil: 1,
        b_activo: 1,
        productos: this.artSalidas
      };
      console.log(this.datos);
      const loading = await this.loadingCtrl.create({
        message: 'Espere un momento...'
      });
      await loading.present();
      this.inventarioServ
        .Post(this.token, this.url, this.datos)
        .subscribe((data: any) => {
          console.log(data);
          if (data.status == 'fail') {
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

  deleteProducto(id: number) {
    this.artSalidas.splice(id, 1);
    console.log(this.artSalidas);
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

  /* Checar Salidas */
  async cargaRegistros() {
    this.inventarioServ.GetAll(this.token, this.url).subscribe((data: any) => {
      console.log(data);
    });
  }

}
