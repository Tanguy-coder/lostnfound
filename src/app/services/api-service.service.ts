import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private registerUrl = "http://localhost:8080/register"
  private loginUrl = "http://localhost:8080/login"
  private rolesUrl = "http://localhost:8080/roles"
  constructor(private http :HttpClient) { }

  submitRegisterUser(formData: any):Observable <any>{
    return this.http.post(this.registerUrl,formData);
  }

  submitLoginUser(formData:any): Observable <any>{
    return this.http.post(this.loginUrl,formData);
  }

  getRoles():Observable <any>{
    return this.http.get(this.rolesUrl)
  }
}
