import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-qr-pre-requisicion',
  templateUrl: './qr-pre-requisicion.page.html',
  styleUrls: ['./qr-pre-requisicion.page.scss'],
})
export class QrPreRequisicionPage implements OnInit {

  // Data QR Page --> View-Pre-requisicion
  public folio = this.navParams.get('folio');

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    console.log(this.folio);
   }

  ngOnInit() {
  }

  closeModal(data: any) {
    this.modalCtrl.dismiss(data);
  }

}
