import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { conexion } from './conexion';

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  constructor(
    private http: HttpClient
  ) { }
}
