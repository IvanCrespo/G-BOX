import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-qr-pre-requisicion',
  templateUrl: './qr-pre-requisicion.page.html',
  styleUrls: ['./qr-pre-requisicion.page.scss'],
})
export class QrPreRequisicionPage implements OnInit {

  // Data QR Page --> View-Pre-requisicion
  public qrFolio = this.navParams.get('folio');
  public fecha = this.navParams.get('fecha');

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.qrFolio;
    this.fecha;
   }

  ngOnInit() {
  }

  closeModal(data: any) {
    this.modalCtrl.dismiss(data);
  }

}
