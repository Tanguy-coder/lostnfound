import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import du Router
import { ErrorServiceService } from '../../services/error-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private apiService: ApiServiceService, private router: Router) {} // Injection du Router
  
  public responseData: any = null;
  public errorMessage: string = "";
  public passwordMessage: string = "";
  public isSubmited: boolean = false;

  public formData = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmePassword: "",
    role: "",
    telephone: ""
  };

  public roles: any = [];

  // Validation du formulaire
  private validateForm(): boolean {
    if (!this.formData.name || !this.formData.username || !this.formData.email ||
      !this.formData.password || !this.formData.confirmePassword || !this.formData.role ||
      !this.formData.telephone) {
      this.errorMessage = "Veuillez renseigner les champs obligatoires.";
      return false;
    }

    if (this.formData.password !== this.formData.confirmePassword) {
      this.passwordMessage = "Les mots de passe ne correspondent pas.";
      return false;
    }

    return true;
  }

  // Méthode pour l'inscription
  public register() {
    if (!this.validateForm()) {
      return;
    }
    this.apiService.submitRegisterUser(this.formData).subscribe({
      next: (response) => {
        this.isSubmited = true;
        this.responseData = response.data;
        
        // Redirection après succès de l'enregistrement
        console.log('enregistré');
        this.router.navigate(['/login'])
      },
      error: (error) => {
        console.log('Erreur lors de l\'enregistrement : ', error);
        this.errorMessage = error.error.message;
      },
      complete: () => console.log('completed')
    });
  }

  // Récupérer les rôles au chargement du composant
  ngOnInit(): void {
    this.apiService.getRoles().subscribe(
      (response) => {
        this.roles = response;
      },
      (error) => console.log(error)
    );
  }
}
