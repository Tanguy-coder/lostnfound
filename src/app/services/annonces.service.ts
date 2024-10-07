import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Annonces } from '../models/annonces';

@Injectable({
  providedIn: 'root'
})
export class AnnoncesService {

  constructor(private http:HttpClient) { }
  private baseUrl: string = 'http://localhost:8080/annonces';

  getAnnonces(): Observable<any[]> {
    return this.http.get<[Annonces]>(`${this.baseUrl}`);
  }

  getAnnonceById(id: number): Observable<Annonces> {
    return this.http.get<Annonces>(`${this.baseUrl}/${id}`);
  }

  createAnnonce(formData: FormData): Observable<Annonces> {
    return this.http.post<any>(`${this.baseUrl}`, FormData);
  }

  updateAnnonce(annonce: Annonces): Observable<Annonces> {
    return this.http.put<Annonces>(`${this.baseUrl}/${annonce.id}`, annonce);
  }

  deleteAnnonce(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
