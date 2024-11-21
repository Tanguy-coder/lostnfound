import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
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
    return this.http.post<Annonces>(`${this.baseUrl}`, formData).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de la création de l\'annonce', error);
        return throwError(error);
      })
    );
  }

  updateAnnonce(annonce: Annonces): Observable<Annonces> {
    return this.http.put<Annonces>(`${this.baseUrl}/${annonce.id}`, annonce);
  }

  deleteAnnonce(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }



  validerAnnonce(annonceId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${annonceId}/valider`, {});
  }

  getLatestAnnonces():Observable<any[]> {
    return this.http.get<[Annonces]>(`${this.baseUrl}/latest`);
  }

}
