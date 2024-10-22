import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8080/messages'; // L'URL de l'API

  constructor(private http: HttpClient) {}

  sendMessage(senderId: number, receiverId: number, content: string): Observable<Message> {
    const params = { senderId, receiverId, content };
    return this.http.post<Message>(`${this.apiUrl}/send`, params);
  }

  getReceivedMessages(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/received/${userId}`);
  }

  getSentMessages(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/sent/${userId}`);
  }

  getMessagesByAnnonceId(annonceId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`http://localhost:8080/messages/annonce/${annonceId}`);
  }
  
}
