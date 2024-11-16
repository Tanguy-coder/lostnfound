import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import du Router

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
    role: "user",
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
  register() {
    this.isSubmited = true;
    
    if (this.formData.password !== this.formData.confirmePassword) {
      this.passwordMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    // Appeler le service d'inscription
    this.apiService.submitRegisterUser(this.formData).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        this.router.navigate(['login']);
        this.errorMessage = '';
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = error.error.error || 'Erreur lors de l’inscription.';
        } else {
          this.errorMessage = 'Une erreur inconnue est survenue.';
        }
      },
    });
  }

  // Récupérer les rôles au chargement du composant
  ngOnInit(): void {
    this.apiService.getRoles().subscribe(
      (response) => {
        this.roles = response;
        console.log(response)
      },
      (error) => console.log(error)
    );
  }
}
