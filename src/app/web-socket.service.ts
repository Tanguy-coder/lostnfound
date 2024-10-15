// src/app/web-socket.service.ts
import { Injectable } from '@angular/core';
import  SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs'; // Utilisation de la classe Client de stompjs
import { Observable, Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client = new Client;
  private messagesSubject: Subject<Message> = new Subject<Message>();

  constructor() { }

  connect(): void {
    const socket = new SockJS('http://localhost:8080/chat-websocket'); // Vérifiez que l'URL est correcte
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => { console.log(new Date(), str); },
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        // S'abonner aux messages provenant du backend
        this.stompClient.subscribe('/topic/messages', (messageOutput: any) => {
          console.log('Message reçu: ', JSON.parse(messageOutput.body));
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });

    this.stompClient.activate(); // Activer la connexion STOMP
  }

  // Envoyer un message au serveur
  sendMessage(message: Message): void {
    if (this.stompClient.connected) {
      this.stompClient.publish({ destination: '/app/sendMessage', body: JSON.stringify(message) });
    }
  }

  // Fermer la connexion WebSocket
  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
    }
    console.log('Disconnected');
  }

    // Retourne un Observable pour les messages reçus
    getMessages(): Observable<Message> {
      return this.messagesSubject.asObservable();
    }





}




