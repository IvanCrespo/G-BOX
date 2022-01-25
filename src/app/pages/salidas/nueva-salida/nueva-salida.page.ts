import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nueva-salida',
  templateUrl: './nueva-salida.page.html',
  styleUrls: ['./nueva-salida.page.scss'],
})
export class NuevaSalidaPage implements OnInit {

  /* Datos de Formulario */
  s_folio: string = '------';
  s_empresa: string = 'Cajinsa';
  estatus: any = 'Pendiente';

  constructor() { }

  ngOnInit() {
  }

}
