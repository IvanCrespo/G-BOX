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

  Post(s_token: string, url: string, data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Licencia': conexion.licencia,
      'Token': s_token
    });
    let options = { headers: headers };
    return this.http.post(conexion.url + url, data, options);
  }

  GetAll(s_token: string, url: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Licencia': conexion.licencia,
      'Token': s_token
    });
    let options = { headers: headers };
    return this.http.get(conexion.url + url, options);
  }

}
