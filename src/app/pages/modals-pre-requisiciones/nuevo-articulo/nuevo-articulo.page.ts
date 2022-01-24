import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, ActionSheetController } from '@ionic/angular';
/* Plugins */
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { InventariosService } from 'src/app/services/inventarios.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'app-nuevo-articulo',
  templateUrl: './nuevo-articulo.page.html',
  styleUrls: ['./nuevo-articulo.page.scss'],
})
export class NuevoArticuloPage implements OnInit {

  /* URL Services */
  private url = 'unidades_medidas';

  /* Data LocalStorage */
  token: any;

  n_cantidad: number;
  s_descripcion_producto: string;
  s_orden_mantenimiento: string;
  s_foto: string = null;
  datos: any = {};
  previewPhoto: string;
  id_unidad_medida: any;


  /* Unidades de Medida */
  unidades: any;

  constructor(
    private modalCtrl: ModalController,
    private camera: Camera,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    private inventarioServ: InventariosService
  ) {
    this.token = localStorage.getItem('s_token');
    this.ionViewWillEnter();
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.cargarUnidades();
   }

  async cargarUnidades() {
    this.inventarioServ.GetAll(this.token, this.url).subscribe((data: any) => {
      this.unidades = data.data.unidad_medida;
    });
  }

  closeModal(data: any) {
    /* console.log(data); */
    this.modalCtrl.dismiss(data);
  }

  takePhoto(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/png;base64,' + imageData;
      this.s_foto = base64Image;
      console.log(this.s_foto);
      this.previewPhoto = base64Image;
    }, (err) => {
      console.error("Error: no tiene imagen", JSON.stringify(err));
    });
  }

  async save() {
    if (this.id_unidad_medida == null || this.id_unidad_medida == undefined) {
      this.presentToast("Campo Unid. de Medida no debe estar vacio");
    }
    else if (this.n_cantidad == null || this.n_cantidad == undefined) {
      this.presentToast("Campo Cantidad no debe estar vacio");
    }
    else if (this.n_cantidad <= 0) {
      this.presentToast("Campo Cantidad tiene numeros negativos");
    }
    else if (this.s_descripcion_producto == null || this.s_descripcion_producto == undefined) {
      this.presentToast("Campo Nombre del Articulo no debe estar vacio");
    }
    else {
      if (this.s_orden_mantenimiento == "" || this.s_orden_mantenimiento == undefined || this.s_orden_mantenimiento == null) {
        this.s_orden_mantenimiento = "N/A";
      }
      let data = {
        id_unidad_medida: this.id_unidad_medida,
        n_cantidad: this.n_cantidad,
        s_descripcion_producto: this.s_descripcion_producto,
        s_foto: this.s_foto,
        /* s_foto: "data:image/png;base64,", */
        s_orden_mantenimiento: this.s_orden_mantenimiento
      };
      this.datos = data;
      this.closeModal(this.datos);
      this.presentToast("Articulo Agregado");
    }
  }

  checkRealTime(n_cantidad) {
    if (n_cantidad != null) {
      if (n_cantidad <= 0) {
        this.presentToast("Campo Cantidad no acepta numeros negativos");
      }
      else if (n_cantidad == undefined) {
        return false;
      }
      else if (n_cantidad > 0) {
        return false;
      }
    }
  }

  async presentToast(mensaje) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    });
    await toast.present();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Seleccionar Imagen",
      buttons: [{
        text: 'Cargar desde biblioteca',
        handler: () => {
          this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Usar Camara',
        handler: () => {
          this.takePhoto(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
}
