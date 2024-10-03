import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService,User } from '../users.service'; 
import { UserEditComponent } from '../user-edit/user-edit.component'; // Importez le service et l'interface User

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule], // Importez CommonModule pour utiliser *ngFor
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];  // Le tableau où les utilisateurs seront stockés

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;  // Stockez les utilisateurs récupérés dans le tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }
}
