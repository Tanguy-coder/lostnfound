import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../users.service'; // Service pour les utilisateurs
import { MessageService } from '../message.service'; // Service pour les messages
import { User } from '../users.service'; // Modèle utilisateur
import { Message } from '../message.model'; // Modèle message
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from '../web-socket.service';
import { Annonces } from '../models/annonces';
import { AnnoncesService } from '../services/annonces.service';


@Component({
  selector: 'app-boite',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [UserService, MessageService],
  templateUrl: './boite.component.html',
  styleUrls: ['./boite.component.css']
})
export class BoiteComponent implements OnInit {
  users: User[] = [];
  messages: Message[] = [];
  id = Number(localStorage.getItem('currentUser'));
  lastMessages: { participants: string, message: Message }[] = [];
  public annonces: Annonces[] = [];
  m1=Number(localStorage.getItem("currentUser"));


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private cdRef: ChangeDetectorRef,
    private webSocketService: WebSocketService,
    private annonceService:AnnoncesService,
    
    
  ) {}

  ngOnInit(): void {
    // Récupérer les utilisateurs ayant envoyé des messages
    this.getUsersFromMessages();
    this.getAnnonces();
    this.getAllMessages();
    

    const  userId=this.route.snapshot.paramMap.get("userId");
     

    

    console.log("id "+this.m1);


  

    // Souscription au WebSocket pour recevoir les nouveaux messages en temps réel
    this.webSocketService.getMessages().subscribe((message: Message) => {
      this.messages.push(message);
      // Regrouper les messages après avoir reçu un nouveau message
      this.cdRef.detectChanges();  // Détecte et met à jour l'interface
    });

   

    console.log("identfiant"+this.m1);
  }

  // Récupérer les utilisateurs à partir des messages
  getUsersFromMessages(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  // Récupérer les messages par utilisateur
  getMessagesByUser(userId:number, userId2: number, annonceId: number) {

    this.httpClient.get<Message[]>(`http://localhost:8080/msg/${userId}/${userId2}/${annonceId}`,{responseType:'json'}).subscribe(
      (messages) => {
        console.log("mise a jour");
        this.messages = messages.sort((a, b) => {
          return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime();
      });
        console.log("messages recuperes",this.messages)
        this.cdRef.detectChanges();
         // Met à jour la liste des messages
      },
      (error) => {
        console.error('Erreur lors de la récupération des messages', error);

      }
    );
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





  public getAnnonces(): void {
    this.annonceService.getAnnonces().subscribe((liste) => {
      this.annonces = liste
    })
  }

  // Regrouper et afficher uniquement le dernier message par discussion (sender/receiver) sans répétition
  groupLastMessagesByDiscussion(): void {
    const lastMessagesMap = new Map<string, Message>();

  
    

    this.messages.forEach((message: Message) => {
      // Créer une clé unique pour chaque paire d'utilisateurs et l'annonce, peu importe l'ordre (sender/receiver ou receiver/sender)
      const participantsKey = [message.sender.username, message.receiver.username].sort().join('-') + '-annonce-' + message.annonce.id;

      // Si la discussion entre ces participants et cette annonce n'existe pas encore, ou si le message est plus récent
      if (!lastMessagesMap.has(participantsKey) || lastMessagesMap.get(participantsKey)!.sentAt < message.sentAt) {
        lastMessagesMap.set(participantsKey, message);
        
      }
    });

    // Transformer le Map en tableau pour l'affichage
    this.lastMessages = Array.from(lastMessagesMap.entries()).map(([participants, message]) => ({
      participants,
      message
    }));

   
  }
}
