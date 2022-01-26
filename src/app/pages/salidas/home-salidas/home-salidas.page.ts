import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { NavController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { InventariosService } from 'src/app/services/inventarios.service';
import { NuevaSalidaPage } from '../nueva-salida/nueva-salida.page';

@Component({
  selector: 'app-home-salidas',
  templateUrl: './home-salidas.page.html',
  styleUrls: ['./home-salidas.page.scss'],
})
export class HomeSalidasPage implements OnInit {

  /* URL Services */
  private url = 'salidas';

  scannedData: any;
  formatoData: any;
  textQR: any;
  timer: any;

  /* Data LocalStorage */
  token: any;

  constructor(
    private scanner: BarcodeScanner,
    private navCtrl: NavController,
    private inventarioServ: InventariosService,
    private modalController: ModalController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
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

  async checkRealTime(folio_prerequisicion) {
    if (this.timer) clearTimeout(this.timer);
    let self = this;
    this.timer = setTimeout(function () {
      console.log(folio_prerequisicion);
      self.inventarioServ.GetAll(self.token, self.url).subscribe(
        (res: any) => {
          if (res.status == "fail") {
            return false;
          }
          else {
            self.buscarPrerequisicion(folio_prerequisicion);
          }
        },
        (err: any) => {
          console.log('Error', err.message);
        }
      )
    }, 1000);
  }

  async buscarPrerequisicion(folio: string) {
    this.inventarioServ.GetAll(this.token, `pre_requisicion?s_folio=${folio}`).subscribe((res: any) => {
      console.log(res);
      if (!this.isNotErrorApiResponse(res)) {
        this.presentToast(res.message, "danger", 3000);
        return false;
      }
      else if (res.data.pre_requisicion.length > 1) {
        this.presentToast(`Ingrese un folio de pre-requisicion`, "warning", 3000);
        return false;
      }
      else if (res.data.pre_requisicion.id_estatus_pre_requisicion != 2) {
        this.presentToast(`Pre-requisición no autorizada, Autorice la Pre-requisición para poder continuar`, "warning", 3000);
        return false;
      }
      else {
        console.log('Entra a modal');
        let data = res.data.pre_requisicion;
        this.presentToast(`Folio aceptado`, res.status, 3000);
        this.modalNuevaSalida(data);
      }
    })
  }

  async modalNuevaSalida(data: any) {
    let prerequisicion = data;
    const modal = await this.modalController.create({
      component: NuevaSalidaPage,
      componentProps: { prerequisicion: prerequisicion }
    });
    return await modal.present();
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
