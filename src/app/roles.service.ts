import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



export interface roles {
  id: number;
  name: string;

}


@Injectable({
  providedIn: 'root'
})





export class RolesService {

  private apiUrl = 'http://localhost:8080';




  constructor(private http: HttpClient) { }

 
  getroles(): Observable<roles[]> {
    return this.http.get<roles[]>(`${this.apiUrl}/users`);
  }





 }
