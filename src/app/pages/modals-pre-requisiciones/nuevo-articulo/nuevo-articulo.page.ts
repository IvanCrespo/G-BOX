import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

/* Plugins */
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';


@Component({
  selector: 'app-nuevo-articulo',
  templateUrl: './nuevo-articulo.page.html',
  styleUrls: ['./nuevo-articulo.page.scss'],
})
export class NuevoArticuloPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private camera: Camera
  ) { }

  ngOnInit() {
  }

  closeModal() {
    const mensaje: string = "Data!";
    this.modalController.dismiss(mensaje);
  }

}
