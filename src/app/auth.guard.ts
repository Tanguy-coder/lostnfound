import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Vérifie si le token est présent

    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirige vers la page de connexion si non authentifié
      return false;
    }
    return true; // Permet l'accès à la route si authentifié
  }
}
