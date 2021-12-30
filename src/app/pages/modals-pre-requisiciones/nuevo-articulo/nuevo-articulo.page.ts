import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
/* Plugins */
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';


@Component({
  selector: 'app-nuevo-articulo',
  templateUrl: './nuevo-articulo.page.html',
  styleUrls: ['./nuevo-articulo.page.scss'],
})
export class NuevoArticuloPage implements OnInit {

  n_cantidad: number;
  s_descripcion_producto: string;
  s_orden_mantenimiento: string;
  s_foto: string = null;
  datos: any = {};

  constructor(
    private modalCtrl: ModalController,
    private camera: Camera,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  closeModal(data: any) {
    /* console.log(data); */
    this.modalCtrl.dismiss(data);
  }

  async takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/png;base64,' + imageData;
      this.s_foto = base64Image;
      console.log(this.s_foto);
    }, (err) => {
      console.error("Error", JSON.stringify(err));
      this.s_foto = "";
    });
  }

  async save() {
    let data = {
      n_cantidad: this.n_cantidad,
      s_descripcion_producto: this.s_descripcion_producto,
      /* s_foto: this.s_foto, */
      s_foto: "data:image/png;base64,",
      s_orden_mantenimiento: this.s_orden_mantenimiento
    };
    /* console.log(data); */
    if (data.n_cantidad == null || data.s_descripcion_producto == null || data.n_cantidad == undefined || data.s_descripcion_producto == undefined) {
      this.presentToast("Campos Cantidad y Descripción Productos no deben estar vacios");
    }
    else {
      this.datos = data;
      this.closeModal(this.datos);
      this.presentToast("Articulo Agregado");
    }
  }

  async presentToast(mensaje) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    });
    await toast.present();
  }
}
