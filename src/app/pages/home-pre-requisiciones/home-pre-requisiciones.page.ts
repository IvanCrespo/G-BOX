import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home-pre-requisiciones',
  templateUrl: './home-pre-requisiciones.page.html',
  styleUrls: ['./home-pre-requisiciones.page.scss'],
})
export class HomePreRequisicionesPage implements OnInit {

  constructor(
    private toastController: ToastController,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  add() {
    this.navController.navigateForward(['/pre-requisicion']);
  }

}
