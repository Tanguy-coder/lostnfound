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
  public receiver : any = {};
  m1=Number(localStorage.getItem("currentUser"));
  s1=Number(localStorage.getItem("publicateur"));
  lastMessages: { participants: string, message: Message }[] = [];

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
    const userId2=(this.route.snapshot.paramMap.get("annonce.user.id"));

    console.log("id "+id+"userId2"+userId2 +"m1 :"+this.m1);
    
   //this.groupLastMessagesByDiscussion();
    
   
    
    if(id){
      this.loadUser(this.m1)
      this.loadAnnonces(parseInt(id))

      this.getMessagesByUser(this.m1,Number(userId2),parseInt(id));
      this.getAnnonces();
      this.getAllMessages();
    }
    // Souscrire aux messages reçus
    this.webSocketService.getMessages().subscribe((message: Message) => {
      this.messages.push(message);
      // console.log('Message reçu: ', message);
      this.cdRef.detectChanges();
      
    });

    
  }

  /***Avant l'initialisation du composant je fais ceci récupérer en avance l'annonce */
  ngOnChange(){
    const id = (this.route.snapshot.paramMap.get('id'));
    const userId2=(this.route.snapshot.paramMap.get("annonce.user.id"));

    this.getAllMessages();
    this.cdRef.detectChanges();

    

    if (id) {
      this.loadAnnonces(parseInt(id))
      this.getMessagesByUser(this.m1,Number(userId2),parseInt(id));

      
      

    }

    
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') {
      return;
    }

    //this.annonceur=(this.route.snapshot.paramMap.get("annonce.user.id"));

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

    console.log("sender"+this.sender.id+"receveeur"+this.annonceur.id);

    this.webSocketService.sendMessage(message);
    console.log("le message a envoyer"+message.receiver.id);
    this.newMessage = ''; // Réinitialiser le champ du message

   // console.log("affichage"+this.annonceur.id +"||" + this.annonce.id+'||'+this.sender.id);
    this.getMessagesByUser(this.m1,parseInt(this.annonceur_id),parseInt(this.annonce.id)); // Mise à jour directe
    this.getAllMessages();
    this.cdRef.detectChanges(); // Forcer la mise à jour de l'affichage
  }


  getMessagesByUser(userId:number, userId2: number, annonceId: number) {


    this.httpClient.get<Message[]>(`http://localhost:8080/msg/${userId}/${userId2}/${annonceId}`,{responseType:'json'}).subscribe(
      (messages) => {
        console.log("mise a jour");
        this.messages = messages.sort((a, b) => {
          return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime();
      });
        console.log("messages recuperes",this.messages);
        console.log("userid"+userId+"userId2"+userId2+"annonceid"+annonceId);
        this.cdRef.detectChanges();
         // Met à jour la liste des messages
      },
      (error) => {
        console.error('Erreur lors de la récupération des messages en cours', error);
        

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










  groupLastMessagesByDiscussion(): void {
    // Récupérer les messages depuis le backend
    this.httpClient.get<Message[]>('http://localhost:8080/messages', { responseType: 'json' }).subscribe(
      (messages) => {
        // Trier les messages par date d'envoi
        this.messages = messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
        console.log('Tous les messages récupérés pour etre groupés:', this.messages);
        
        // Mettre à jour l'affichage
        this.cdRef.detectChanges(); 
  
        // Créer une map pour regrouper les derniers messages
        const lastMessagesMap = new Map<string, Message>();
  
        // Parcourir chaque message
        this.messages.forEach((message: Message) => {
          // Vérifiez que le message contient les propriétés nécessaires
          if (!message.sender || !message.receiver || !message.annonce) {
            console.warn('Message avec des propriétés manquantes:', message);
            return; // Ignorer ce message s'il manque des informations essentielles
          }
  
          // Vérifiez que les noms d'utilisateur sont présents
          if (!message.sender.id || !message.receiver.id) {
            console.warn('Nom d\'utilisateur manquant pour sender ou receiver:', message);
            return; // Ignorer ce message si les noms d'utilisateur sont manquants
          }
  
          // Créer une clé unique pour chaque combinaison de participants (sender/receiver) et l'annonce
          const participantsKey = [
            message.sender.id,
            message.receiver.id
          ].sort().join('-') + '-annonce-' + message.annonce.id;
  
          console.log('Participants Key:', participantsKey, 'Message:', message);
  
          // Si la discussion n'existe pas encore, ou si le message est plus récent, le mettre à jour
          if (!lastMessagesMap.has(participantsKey) || lastMessagesMap.get(participantsKey)!.sentAt < message.sentAt) {
            lastMessagesMap.set(participantsKey, message);
            console.log('Message ajouté ou mis à jour:', message);
          }
        });
  
        // Transformer la Map en tableau pour l'affichage
        this.lastMessages = Array.from(lastMessagesMap.entries()).map(([participants, message]) => ({
          participants,
          message
        }));

        this.cdRef.detectChanges(); 
        console.log('Derniers messages regroupés:', this.lastMessages);
      },
      (error) => {
        console.error('Erreur lors de la récupération des messages:', error);
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
