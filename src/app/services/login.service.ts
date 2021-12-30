import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { conexion } from './conexion';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  datos: {};

  constructor(
    private http: HttpClient
  ) { }

  login(user, password) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Licencia': conexion.licencia
    });
    let options = { headers: headers };
    let url = conexion.url + "login";

    this.datos = {
      "user": user,
      "password": password
    }
    return this.http.post(url, this.datos, options);
  }

}

