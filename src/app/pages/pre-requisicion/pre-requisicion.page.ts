import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { NuevoArticuloPage } from '../modals-pre-requisiciones/nuevo-articulo/nuevo-articulo.page';

/* Plugins */
import { Geolocation, Geoposition } from '@awesome-cordova-plugins/geolocation/ngx';


@Component({
  selector: 'app-pre-requisicion',
  templateUrl: './pre-requisicion.page.html',
  styleUrls: ['./pre-requisicion.page.scss'],
})
export class PreRequisicionPage implements OnInit {

  lat: number;
  lon: number;
  fecha: string;
  hora: string;
  imagen: string = "";
  datos: any = {};
  productos: any = [];

  /* Datos de Formulario */
  s_folio: string = "00001";
  s_empresa: string = "Cajinsa";
  estatus: any = 1;
  usuario_solicitante: any; 
  d_fecha_estimada_entrega: any;
  s_nota_pre_requisicion: any;

  constructor(
    private modalController: ModalController,
    public toastCtrl: ToastController,
    private geolocation: Geolocation
  ) {
    var d = new Date();
    this.fecha = ("00" + d.getDate()).slice(-2) + "/" + ("00" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    this.hora = ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2);
    this.getGeolocation();
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

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
    });
  }

}
