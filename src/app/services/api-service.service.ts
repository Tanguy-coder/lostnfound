import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private registerUrl = "http://localhost:8080/register"
  constructor(private http :HttpClient) { }

  submitRegisterUser(formData: any):Observable <any>{
    return this.http.post(this.registerUrl,formData);
  }
}
