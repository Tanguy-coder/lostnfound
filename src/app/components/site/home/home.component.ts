import { Component } from '@angular/core';
import { User } from '../../../users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css',]
})
export class HomeComponent {


  users: User[] = [];

}
