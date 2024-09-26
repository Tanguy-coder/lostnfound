import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AnnonceComponent } from './annonce/annonce.component';
import { User, UserService } from './users.service';
import { UsersComponent } from './users/users.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})






export class AppComponent implements OnInit{

  title = 'lostnfoundfront';

  constructor(private router: Router,private userService: UserService) {}

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  isRegisterRoute(): boolean {
    return this.router.url === '/register';
  }


  logout(): void {
    // Optionnel : supprimer les informations d'authentification
    localStorage.removeItem('authToken'); // Ou autre clé si tu utilises un autre stockage
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }





  users: User[] = []; // Stocke les utilisateurs récupérés


  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }
}











 
  

