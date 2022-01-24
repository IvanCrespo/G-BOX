import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, ActionSheetController, NavParams } from '@ionic/angular';
/* Plugins */
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-view-articulo',
  templateUrl: './view-articulo.page.html',
  styleUrls: ['./view-articulo.page.scss'],
})
export class ViewArticuloPage implements OnInit {

  /* URL Services */
  private urlunidadmedida = 'unidades_medidas';

  // Data de articulo Page --> Pre-requisicion
  public value = this.navParams.get('producto');
  public idSelected = this.navParams.get('index');

  // Data
  s_foto: string = null;
  previewPhoto: string;
  n_cantidad: number;
  s_descripcion_producto: string;
  s_orden_mantenimiento: string;
  datos: any = {};
  id_unidad_medida: number;
  unidad_medida: any;

  /* Disable */
  isDisabled: boolean = false;
  isButton: number = 0;

  /* Data LocalStorage */
  token: any;

  /* Unidades de Medida */
  unidades: any;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    public toastCtrl: ToastController,
    private inventarioServ: InventariosService
  ) {
    this.token = localStorage.getItem('s_token');
    this.ionViewWillEnter();
  }

  ngOnInit() {
    if (this.idSelected == 2) {
      this.isDisabled = true;
      this.isButton = 0;
    }
    else if (this.idSelected == 1) {
      this.isDisabled = false;
      this.isButton = 1;
    }
    this.n_cantidad = this.value.n_cantidad;
    this.s_descripcion_producto = this.value.s_descripcion_producto;
    this.previewPhoto = this.value.s_foto;
    this.s_foto = this.value.s_foto;
    this.s_orden_mantenimiento = this.value.s_orden_mantenimiento;
  }

  ionViewWillEnter() {
    this.cargarUnidades();
  }

  async cargarUnidades() {
    this.inventarioServ.GetAll(this.token, this.urlunidadmedida).subscribe((data: any) => {
      this.unidades = data.data.unidad_medida;
      this.id_unidad_medida = this.value.id_unidad_medida;
    });
  }

  closeModal(data: any) {
    this.modalCtrl.dismiss(data);
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
        s_orden_mantenimiento: this.s_orden_mantenimiento
      };
      this.datos = data;
      this.closeModal(this.datos);
      this.presentToast("Articulo Editado");
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

  /* edit() {
    if (this.status == 1) {
      this.isDisabled = false;
      this.presentToast('Modo Editable');
      this.isButton = 1;
    }
    else if (this.status == 2 || this.status == 3 || this.status == 4 || this.status == 5 ) {
      this.presentToast('La pre-requisición debe estar en Pendiente');
    }
  } */

  async presentToast(mensaje) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    });
    await toast.present();
  }

}
