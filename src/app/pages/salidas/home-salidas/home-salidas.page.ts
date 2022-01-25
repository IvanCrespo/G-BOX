import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home-salidas',
  templateUrl: './home-salidas.page.html',
  styleUrls: ['./home-salidas.page.scss'],
})
export class HomeSalidasPage implements OnInit {

  scannedData: any;
  formatoData: any;
  textQR: any;

  constructor(
    private scanner: BarcodeScanner,
    private navCtrl: NavController
  ) { }

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

  search() {
    this.navCtrl.navigateForward(['/nueva-salida']);
  }

}
