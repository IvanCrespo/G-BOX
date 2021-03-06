import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController, NavParams, NavController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.page.html',
  styleUrls: ['./nuevo-producto.page.scss'],
})
export class NuevoProductoPage implements OnInit {

  /* URL Services */
  private url = 'productos';

  // Data de articulos Salida --> Nueva-Salida
  public value = this.navParams.get('productos');
  public edit = this.navParams.get('productoSalida');

  /* Scanner */
  scannedData: any;
  formatoData: any;
  textQR: any;

  /* Datos */
  timer: any;
  timerSalida: any;
  id_producto: number;
  s_codigo_producto: any;
  s_producto: string;
  n_cantidad_producto_empresa: number;
  s_unidad_medida: any;
  n_stock_final: number = 0;
  s_foto: any;
  n_cantidad_salida: number;
  datos: any = {};
  resultado

  /* Data LocalStorage */
  token: any;

  /* Disable */
  activated: boolean = false;
  editable: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private scanner: BarcodeScanner,
    private inventarioServ: InventariosService,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private navParams: NavParams,
    private navCtrl: NavController
  ) {
    this.token = localStorage.getItem('s_token');
    console.log(this.edit);
    if (this.edit != undefined) {
      this.editable = true;
      this.id_producto = this.edit.id_producto;
      this.s_producto = this.edit.s_producto;
      this.s_codigo_producto = this.edit.s_codigo_producto;
      this.s_unidad_medida = this.edit.s_unidad_medida;
      this.n_cantidad_producto_empresa = this.edit.n_cantidad_anterior;
      this.n_stock_final = this.edit.n_cantidad_nueva;
      this.n_cantidad_salida = this.edit.n_cantidad;
      this.inventarioServ.AllById(this.token, this.url, this.id_producto).subscribe(
        (res: any) => {
          if (!this.isNotErrorApiResponse(res)) {
            this.presentToast(res.message, "danger", 2500);
            return false;
          }
          else {
            this.s_foto = res.data.producto.s_foto;
          }
        });
    }
    else {
      this.editable = false;
    }
  }

  ngOnInit() {
  }

  scanBarcode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Enfoque el c??digo QR con la c??mara',
      resultDisplayDuration: 500,
      formats: 'EAN_13,EAN_8,QR_CODE,PDF_417 ',
      orientation: 'portrait',
    };

    this.scanner.scan(options).then(barcodeData => {
      this.scannedData = JSON.stringify(barcodeData.text);
      this.formatoData = JSON.stringify(barcodeData.format);
      const newTextQR = this.scannedData.replace(/["']/g, "");
      this.textQR = newTextQR;
    }).catch(err => {
      console.log('Error', err);
    });
  }

  async checkRealTime(producto) {
    const loading = await this.loadingCtrl.create({
      message: 'Espere un momento...',
      duration: 1000,
    });
    if (this.timerSalida) clearTimeout(this.timerSalida);
    let self = this;
    this.timerSalida = setTimeout(function () {
      if (self.value.find(productos => productos.s_codigo_producto == producto)) {
        self.presentToast(`El producto con el c??digo ${producto} ya lo tiene agregado en Salidas`, "danger", 2500);
      }
      else {
        self.inventarioServ.GetAll(self.token, `buscar_producto?s_codigo_producto=${producto}`).subscribe(
          (res: any) => {
            if (!self.isNotErrorApiResponse(res)) {
              self.presentToast(res.message, "danger", 2500);
              self.activated = false;
              return false;
            }
            else if (res.data.productos.length == 0) {
              self.presentToast(`El codigo del producto no se encontro`, "warning", 2500);
              self.activated = false;
              loading.present();
              return false;
            }
            else {
              self.presentToast(res.message, res.status, 2500);
              self.textQR = '';
              const data = res.data;
              self.id_producto = data.productos[0].id_producto;
              self.s_producto = data.productos[0].s_producto;
              self.s_codigo_producto = data.productos[0].s_codigo_producto;
              self.s_unidad_medida = data.productos[0].unidad_medida.s_nombre;
              self.n_cantidad_producto_empresa = data.productos[0].producto_empresa[0].n_cantidad_producto_empresa;
              self.s_foto = 'http://hostaria.sytes.net:1318/api_gbox/' + data.productos[0].s_foto;
              self.n_stock_final = self.n_cantidad_producto_empresa;
              self.activated = true;
              loading.present();
            }
          },
          (err: any) => {
            console.log('Error', err.message);
          }
        )
      }
    }, 1000);
    loading.dismiss();
  }

  checkNumber(n_cantidad_salida) {
    if (n_cantidad_salida != null) {
      if (n_cantidad_salida <= 0) {
        this.presentToast("Campo Unidades de Salida no acepta numeros negativos", "warning", 2500);
        this.n_stock_final = this.n_cantidad_producto_empresa;
      }
      else if (n_cantidad_salida == undefined) {
        this.n_stock_final = this.n_cantidad_producto_empresa;
        return false;
      }
      else if (n_cantidad_salida > 0) {
        this.n_stock_final = this.n_cantidad_producto_empresa - n_cantidad_salida;
        if (n_cantidad_salida > this.n_cantidad_producto_empresa) {
          this.n_stock_final = this.n_cantidad_producto_empresa;
          this.presentToast(`La cantidad ingresada de ${this.s_producto} no puede ser mayor al stock existente`, "warning", 2500);
        }
        return false;
      }
    }
    else this.n_stock_final = this.n_cantidad_producto_empresa;
  }

  async save() {
    if (this.n_cantidad_salida == null || this.n_cantidad_salida == undefined) {
      this.presentToast(`Campo Unidades de Salida no debe estar vacio`, "warning", 2500);
    }
    else if (this.n_cantidad_salida <= 0) {
      this.presentToast(`Campo Unidades de Salida no acepta numeros negativos`, "warning", 2500);
    }
    else if (this.n_cantidad_salida > this.n_cantidad_producto_empresa) {
      this.presentToast(`La cantidad ingresada de ${this.s_producto} no puede ser mayor al stock existente`, "warning", 2500);
    }
    else {
      let data = {
        id_producto: this.id_producto,
        n_cantidad: this.n_cantidad_salida,
        n_cantidad_anterior: this.n_cantidad_producto_empresa,
        n_cantidad_nueva: this.n_stock_final,
        s_unidad_medida: this.s_unidad_medida,
        s_producto: this.s_producto,
        s_codigo_producto: this.s_codigo_producto
      };
      this.datos = data;
      this.closeModal(this.datos);
      this.presentToast(`Articulo Agregado`, "success", 2500);
    }
  }

  async editProducto() {
    if (this.n_cantidad_salida == null || this.n_cantidad_salida == undefined) {
      this.presentToast(`Campo Unidades de Salida no debe estar vacio`, "warning", 2500);
    }
    else if (this.n_cantidad_salida <= 0) {
      this.presentToast(`Campo Unidades de Salida no acepta numeros negativos`, "warning", 2500);
    }
    else if (this.n_cantidad_salida > this.n_cantidad_producto_empresa) {
      this.presentToast(`La cantidad ingresada de ${this.s_producto} no puede ser mayor al stock existente`, "warning", 2500);
    }
    else {
      let data = {
        id_producto: this.id_producto,
        n_cantidad: this.n_cantidad_salida,
        n_cantidad_anterior: this.n_cantidad_producto_empresa,
        n_cantidad_nueva: this.n_stock_final,
        s_unidad_medida: this.s_unidad_medida,
        s_producto: this.s_producto,
        s_codigo_producto: this.s_codigo_producto
      };
      this.datos = data;
      this.closeModal(this.datos);
      this.presentToast(`Articulo Agregado`, "success", 2500);
    }
  }

  close() {
    this.closeModal(undefined);
  }

  closeModal(data: any) {
    this.modalCtrl.dismiss(data);
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

}
