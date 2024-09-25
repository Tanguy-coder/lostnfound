import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public responseData: any = null
  public errorMessage: String = ""
  public successMessage: String = ""
  public formData = {
    email: "",
    password: ""
  };


  constructor(private apiService: ApiServiceService, private router: Router) {}

  public login() {
    this.apiService.loginUser(this.formData).subscribe({
      next: (response) => {
        this.responseData = response;
        console.log('Login successful', response);
        // Redirection après connexion réussie
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erreur durant le login:', error);
        this.errorMessage = error.error.message || 'Login failed. Please check your credentials.';
      }
    });
  }

}




