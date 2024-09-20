import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private loginUrl = "http://localhost:8080/login"
  constructor(private http :HttpClient) { }

  submitRegisterUser(formData: any):Observable <any>{
    return this.http.post(this.loginUrl,formData);
  }
}
