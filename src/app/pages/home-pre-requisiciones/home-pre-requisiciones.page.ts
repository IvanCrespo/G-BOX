import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-home-pre-requisiciones',
  templateUrl: './home-pre-requisiciones.page.html',
  styleUrls: ['./home-pre-requisiciones.page.scss'],
})
export class HomePreRequisicionesPage implements OnInit {

  constructor(
    private toastController: ToastController,
    private navController: NavController,
    private inventarioServ: InventariosService,
  ) { }

  ngOnInit() {
  }

  add() {
    this.navController.navigateForward(['/pre-requisicion']);
  }

}
