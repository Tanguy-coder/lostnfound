import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { UserService } from '../users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgFor,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
user: any;



}
