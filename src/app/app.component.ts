import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { User, UserService } from './users.service';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MessageService } from './message.service';
import { WebSocketService } from './web-socket.service';
import { Message } from './message.model';
import { Annonces } from './models/annonces';
import { AnnoncesService } from './services/annonces.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';






@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoginComponent, RegisterComponent,FormsModule,NgFor,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit  {

  title = 'lostnfoundfront';
  currentUser: string | null = null;
  
  constructor(private router: Router,private userService: UserService,private annonceService:AnnoncesService,private httpClient:HttpClient,private cdRef: ChangeDetectorRef) {
    this.currentUser=localStorage.getItem("currentUser")
  }// Récupérer le nom de l'utilisateur actuellement connecté  }

  id_pub=Number(localStorage.getItem("publicateur"));
  users: User[] = [];
  messages: Message[] = [];
  id = Number(localStorage.getItem('currentUser'));
  lastMessages: { participants: string, message: Message }[] = [];
  public annonces: Annonces[] = [];
  m1=Number(localStorage.getItem("currentUser"));
  
  

  ngOnInit(): void {
      


    this.getAnnonces();
    this.getAllMessages();


    
  }







  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  isRegisterRoute(): boolean {
    return this.router.url === '/register';
  }


  public getAnnonces(): void {
    this.annonceService.getAnnonces().subscribe((liste) => {
      this.annonces = liste
      
    })
  }

  getAllMessages(): void {
    this.httpClient.get<Message[]>('http://localhost:8080/messages', { responseType: 'json' }).subscribe(
      (messages) => {
        this.messages = messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
        console.log('Tous les messages récupérés:', this.messages);
        this.cdRef.detectChanges(); // Forcer la mise à jour de l'affichage
      },
      (error) => {
        console.error('Erreur lors de la récupération de tous les messages', error);
      }
    );
  }







  logout(): void {
    // Optionnel : supprimer les informations d'authentification
    localStorage.removeItem('authToken'); // Ou autre clé si tu utilises un autre stockage
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }





}














