import { Component, OnInit, OnDestroy, NgModule, ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Message } from '../message.model';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm, NgModel} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Annonces } from '../models/annonces';
import { ActivatedRoute } from '@angular/router';
import { AnnoncesService } from '../services/annonces.service';
import { UserService } from '../users.service';



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
  public annonce: any  = [];
  public annonceur_id : string = '';
  public annonceur : any = [];
  public sender : any = [];
  m1=Number(localStorage.getItem("currentUser"));
  s1=Number(localStorage.getItem("publicateur"));

  constructor(
          private webSocketService: WebSocketService,
          private httpClient: HttpClient,
          private cdRef: ChangeDetectorRef,
          private route : ActivatedRoute,
          private annonceServie : AnnoncesService,
          private userService: UserService
          ) {}

  ngOnInit(): void {
    this.webSocketService.connect();
  /**
   * Récupérer l'id de l'annonce , récupérer l'annonce pour finalement récupérer le propriéaire de cette annonce
   */
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.loadUser(this.m1)
      this.loadAnnonces(parseInt(id))

      this.getMessagesByUser(this.m1,1,parseInt(id));
      this.getAnnonces();
    }
    // Souscrire aux messages reçus
    this.webSocketService.getMessages().subscribe((message: Message) => {
      this.messages.push(message);
      // console.log('Message reçu: ', message);
    });
  }

  /***Avant l'initialisation du composant je fais ceci récupérer en avance l'annonce */
  ngOnChange(){
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadAnnonces(parseInt(id))

    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') {
      return;
    }

    if (!this.annonce || !this.annonce.id || !this.annonceur) {
      console.error('Données manquantes pour l\'envoi du message.');
      return;
    }

    const message: Message = {
      id: 0, // L'ID sera généré par le serveur
      sender: this.sender,
      receiver: this.annonceur,
      content: this.newMessage,
      annonce: this.annonce,
      sentAt: new Date()
    };


    this.webSocketService.sendMessage(message);
    this.newMessage = ''; // Réinitialiser le champ du message

    this.getMessagesByUser(this.m1,parseInt(this.annonceur_id),parseInt(this.annonce.id)); // Mise à jour directe
    this.cdRef.detectChanges(); // Forcer la mise à jour de l'affichage
  }


  getMessagesByUser(userId:number, userId2: number, annonceId: number) {

    this.httpClient.get<Message[]>(`http://localhost:8080/msg/${userId}/${userId2}/${annonceId}`,{responseType:'json'}).subscribe(
      (messages) => {
        console.log("mise a jour");
        this.messages = messages.sort((a, b) => {
          return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime();
      });
        console.log("zdezazeaz",this.messages)
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

  loadAnnonces(id:number ):void{
    this.annonceServie.getAnnonceById(id).subscribe((res: any) => {
      this.annonce = res
        if (this.annonce.user) {
          this.annonceur = this.annonce.user;
          console.log('Annonceur:', this.annonceur);
          this.annonceur_id = this.annonce?.user.id;
        } else {
          console.warn('Aucun utilisateur trouvé pour cette annonce');
          this.annonceur_id = '';
        }
    }, (error) => {
      console.log(error)
    })
  }

  loadUser(id: number){
    this.userService.getById(id).subscribe((res: any) => {
      this.sender = res
      console.log('Messager:', this.sender);
    }, (error) => {
      console.log(error)
    })
  }
  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
}
