import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.page.html',
  styleUrls: ['./nuevo-producto.page.scss'],
})
export class NuevoProductoPage implements OnInit {

  /* Scanner */
  scannedData: any;
  formatoData: any;
  textQR: any;

  /* Datos */
  timer: any;
  timerSalida: any;

  /* Data LocalStorage */
  token: any;

  constructor(
    private modalCtrl: ModalController,
    private scanner: BarcodeScanner,
    private inventarioServ: InventariosService,
    private toastCtrl: ToastController
  ) {
    this.token = localStorage.getItem('s_token');
  }

  ngOnInit() {
  }

  scanBarcode() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Enfoque el código QR con la cámara',
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
    if (this.timerSalida) clearTimeout(this.timerSalida);
    let self = this;
    this.timerSalida = setTimeout(function () {
      console.log(producto);
      self.inventarioServ.GetAll(self.token, `buscar_producto?s_codigo_producto=${producto}`).subscribe(
        (res: any) => {
          console.log(res);
          if (!self.isNotErrorApiResponse(res)) {
            self.presentToast(res.message, "danger", 3000);
            return false;
          }
          else if (res.data.productos.length == 0) {
            self.presentToast(`El codigo del producto no se encontro`, "warning", 3000);
            return false;
          }
          else {
            self.presentToast(res.message, res.status, 3000);
            self.textQR = '';
            const data = res.data;
            console.log(data);
            /* self.articulo = {
              "id_producto": data.id_producto,
              "s_codigo_producto": data.s_codigo_producto,
              "s_producto": data.s_producto,
              "n_cantidad_producto_empresa": data.producto_empresa[0].n_cantidad_producto_empresa,
              "s_unidad_medida": data.unidad_medida.s_nombre,
              "n_stock_final": 0,
              "s_foto": data.s_foto
            }; */
          }
        },
        (err: any) => {
          console.log('Error', err.message);
        }
      )
    }, 1000);
  }

  closeModal(data: any) {
    this.modalCtrl.dismiss(data);
  }

  /* Errores APIS Status */
  isNotErrorApiResponse(response: any): boolean {
    if (response.status == 'empty') return false;
    if (response.status == 'fail') return false;
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
