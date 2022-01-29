import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { NavController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { InventariosService } from 'src/app/services/inventarios.service';
import { NuevaSalidaPage } from '../nueva-salida/nueva-salida.page';

@Component({
  selector: 'app-home-salidas',
  templateUrl: './home-salidas.page.html',
  styleUrls: ['./home-salidas.page.scss'],
})
export class HomeSalidasPage implements OnInit {

  /* Checked */
  isCheckSalida: boolean = true;

  /* URL Services */
  private url = 'salidas';

  /* Scanner */
  scannedData: any;
  formatoData: any;
  textQR: any;

  /* Datos */
  timer: any;

  /* Data LocalStorage */
  token: any;

  /* Datos Sin Pre-requisicion */
  id_usuario: any;
  empresa: any;
  usuario: string;

  constructor(
    private scanner: BarcodeScanner,
    private navCtrl: NavController,
    private inventarioServ: InventariosService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
    this.token = localStorage.getItem('s_token');
    this.id_usuario = localStorage.getItem('id_usuario');
    this.usuario = localStorage.getItem('usuario');
    this.empresa = localStorage.getItem('empresa');
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
      self.buscarPrerequisicion(folio_prerequisicion);
      /* self.inventarioServ.GetAll(self.token, self.url).subscribe(
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
      ) */
    }, 1000);
  }

  async buscarPrerequisicion(folio: string) {
    this.inventarioServ.GetAll(this.token, `pre_requisicion?s_folio=${folio}`).subscribe((res: any) => {
      if (!this.isNotErrorApiResponse(res)) {
        this.presentToast(res.message, "danger", 2500);
        return false;
      }
      else if (res.data.pre_requisicion.length > 1) {
        this.presentToast(`Ingrese un folio de pre-requisicion`, "warning", 2500);
        return false;
      }
      else if (res.data.pre_requisicion.id_estatus_pre_requisicion != 2) {
        this.presentToast(`Pre-requisición no autorizada, Autorice la Pre-requisición para poder continuar`, "warning", 2500);
        return false;
      }
      else {
        this.presentToast(`Folio aceptado`, res.status, 2500);
        this.textQR = '';
        let data = res.data.pre_requisicion;
        this.modalNuevaSalida(data);
      }
    })
  }

  async modalNuevaSalida(data: any) {
    let prerequisicion = data;
    const modal = await this.modalCtrl.create({
      component: NuevaSalidaPage,
      componentProps: { prerequisicion: prerequisicion }
    });
    return await modal.present();
  }

  /* Modal Sin Pre-requisición */
  async modalNuevaSalidaSinPrerequisicion(data: any) {
    let sinprerequisicion = data;
    const modal = await this.modalCtrl.create({
      component: NuevaSalidaPage,
      componentProps: { sinprerequisicion: sinprerequisicion }
    });
    return await modal.present();
  }

  /* Checked */
  async onChangeCheckSalida(evento: Event) {
    if (!evento) {
      const alert = await this.alertCtrl.create({
        header: 'Confirmar Salida',
        message: 'Desea generar una Nueva Salida sin Pre-requisición?',
        cssClass: 'alertSalida',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              alert.dismiss(false);
              return false;
            }
          },
          {
            text: 'Aceptar',
            handler: () => {
              alert.dismiss(true);
              return false;
            }
          }
        ]
      });
      await alert.present();
      await alert.onDidDismiss().then((data) => {
        let sin_pre = data.data;
        if (sin_pre == true) {
          let data = {
            id_usuario: this.id_usuario,
            empresa: this.empresa,
            usuario: this.usuario,
            sin_prerequisicion: sin_pre
          }
          this.modalNuevaSalidaSinPrerequisicion(data);
        }
        else if(sin_pre == false) {
          this.isCheckSalida = true;
        }
        this.isCheckSalida = true;
      })
    }
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
