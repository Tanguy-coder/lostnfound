// role.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone:true,
  selector: 'app-role',
  imports:[CommonModule,FormsModule],
  templateUrl: './role.component.html',

  styleUrls: ['./role.component.css']
})
export class RoleComponent {
  roleName: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  addRole(): void {
    if (this.roleName) {
      this.http.post('http://localhost:8080/roles/create', { name: this.roleName })
        .subscribe(
          response => {
            console.log('Role enregistré avec succès');
            this.roleName = ''; // Réinitialiser le champ
          },
          error => {
            this.errorMessage = 'Erreur lors de l\'enregistrement du rôle';
            console.error(error);
          }
        );
    } else {
      this.errorMessage = 'Veuillez renseigner le nom du rôle.';
    }
  }
}
