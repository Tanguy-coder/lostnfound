import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { roles } from './roles.service';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // Notez que vous ne devriez pas exposer le mot de passe comme cela
  name: string;
  phone: string;
  role:roles;
  
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080'; // Base URL pour les requêtes
  private currentUser: User |null =null;
  user!: User;
   storedUserId = localStorage.getItem('currentUser');
  
  constructor(private http: HttpClient) {
    // Essayer de charger l'utilisateur à partir du localStorage
    const storedUsername = localStorage.getItem('currentUser');
   
  }

   
  

    // Récupérer l'utilisateur actuellement connecté
    
  



  // Récupère les informations de l'utilisateur par son nom d'utilisateur


  getAuthenticatedUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`); // Assurez-vous que le chemin est correct
  }

  // Met à jour les informations de l'utilisateur
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/${id}`, user);
  }

  updateUser1(userId: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/${userId}/valid`,user)  // Envoyer la requête PUT
  }



  getById(Id: Number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${this.storedUserId}`);
  }


  // Récupère tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  
}
