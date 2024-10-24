import { Component, OnInit, OnDestroy, NgModule, ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Message } from '../message.model';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm, NgModel} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Annonces } from '../models/annonces';




@Component({
  standalone:true,
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.css'],
  imports:[CommonModule,FormsModule]
  
})
export class MessagerieComponent implements OnInit, OnDestroy {
  newMessage: string = '';
  messages: Message[] = [];
  annonces: Annonces[] = [];

   m1=Number(localStorage.getItem("currentUser"));
   s1=Number(localStorage.getItem("publicateur"));
   
  constructor(private webSocketService: WebSocketService,private httpClient: HttpClient,private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.webSocketService.connect();

    this.getMessagesByUser(this.m1);
    this.getAnnonces();
     
    console.log("s1 retourne",localStorage.getItem('publicateur'));
    // Souscrire aux messages reçus
    this.webSocketService.getMessages().subscribe((message: Message) => {
      this.messages.push(message);
      console.log('Message reçu: ', message);
      
    });
  }

  sendMessage(): void {

    if (this.newMessage.trim() === '') {
      return;
    }

    
    
    const message: Message = {
      id: 0, // L'ID sera généré par le serveur
      sender: { id: this.m1, username: 'User1', email: 'user1@example.com' },
      receiver: { id: this.s1, username: 'User2', email: 'user2@example.com' },
      content: this.newMessage,
      annonceId:Number(localStorage.getItem('annonceId')),
      
      sentAt: new Date()
    };
    
    
    this.webSocketService.sendMessage(message);
    this.newMessage = ''; // Réinitialiser le champ du message
    
  
    

    setTimeout(() => {
      this.getMessagesByUser(this.m1);
      this.cdRef.detectChanges(); // Forcer la mise à jour de l'affichage après l'envoi du message
    }, 500); // Attendre 500ms avant de récupérer les messages pour permettre à l'envoi

  
  
  }


 
  

  getMessagesByUser(userId:number) {
    
    userId=this.m1;
    this.httpClient.get<Message[]>(`http://localhost:8080/msg/${userId}`,{responseType:'json'}).subscribe(
      (messages) => {
        console.log("mise a jour");
        this.messages = messages;
        this.cdRef.detectChanges();
         // Met à jour la liste des messages
      },
      (error) => {
        console.error('Erreur lors de la récupération des messages', error);
        
      }
    );
  }


  // Méthode pour récupérer les annonces
  getAnnonces(): void {
    this.httpClient.get<Annonces[]>('http://localhost:8080/annonces', { responseType: 'json' }).subscribe(
      (annonces) => {
        this.annonces = annonces;  // Stocke les annonces récupérées
        console.log('Annonces récupérées:', this.annonces);
      },
      (error) => {
        console.error('Erreur lors de la récupération des annonces', error);
      }
    );
  }
  








  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
}
