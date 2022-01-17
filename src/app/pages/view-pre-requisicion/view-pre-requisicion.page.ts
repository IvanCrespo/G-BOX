import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-pre-requisicion',
  templateUrl: './view-pre-requisicion.page.html',
  styleUrls: ['./view-pre-requisicion.page.scss'],
})
export class ViewPreRequisicionPage implements OnInit {

    /* URL Services */
    private url = 'pre_requisicion';

    /* Disable */
    isDisabled: boolean = false;

    /* Data LocalStorage */
    token: any;
  
    /* Datos de Formulario */
    id_usuario: any;
    s_folio: string;
    s_empresa: string;
    estatus: any;
    usuario_solicitante: any;
    d_fecha_estimada_entrega: any;
    s_nota_pre_requisicion: any;
    productos: any = [];
  
    /* Datos de Click View */
    view: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    /* Data de click View */
    this.activatedRoute.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.view = this.router.getCurrentNavigation().extras.state;
        console.log(this.view);
        this.s_folio = this.view.registro.s_folio;
        this.s_empresa = this.view.registro.empresa.s_empresa;
        if(this.view.registro.id_estatus_pre_requisicion == 1){
          this.estatus = 'Pendiente';
        }
        else if(this.view.registro.id_estatus_pre_requisicion == 2){
          this.estatus = 'Autorizado';
        }
        this.usuario_solicitante = this.view.registro.usuario_solicitante.s_nombre + ' ' +
        this.view.registro.usuario_solicitante.s_paterno + ' ' + this.view.registro.usuario_solicitante.s_materno;
        this.d_fecha_estimada_entrega = this.view.registro.d_fecha;
        this.s_nota_pre_requisicion = this.view.registro.s_nota_pre_requisicion;
        this.productos = this.view.registro.pre_requisiciones_productos;
        this.isDisabled = true;
      }
    });
  }

  ngOnInit() {
  }

}