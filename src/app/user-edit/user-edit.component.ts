import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from '../users.service'; // Assurez-vous que UserService est correctement importé
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { roles,RolesService } from '../roles.service';

@Component({
  standalone: true,
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserEditComponent implements OnInit {
  userForm!: FormGroup; // Formulaire pour l'utilisateur
  user!: User; // L'utilisateur actuel
  isLoading: boolean = false;
  userId = (localStorage.getItem('currentUser')); // État de chargement

  role: roles[] = [];
  
  

  






  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private roleService: RolesService
  ) {  }


  ngOnInit(): void {
    this.roleService.getroles().subscribe(
      (role: roles[]) => {
        this.role = role;  // Stockez les utilisateurs récupérés dans le tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  









  
    // Récupérer le nom d'utilisateur depuis l'URL
    const userId = Number(localStorage.getItem('currentUser'));
    
    console.log('Nom d\'utilisateur:', userId); // Afficher le nom d'utilisateur

    // Initialiser le formulaire
    this.userForm = this.fb.group({
      username: [ '' ,Validators.required], // Nom d'utilisateur désactivé
      email: ['', [Validators.required, Validators.email]], // Champ email
      password: ['', Validators.required], // Champ mot de passe
      name: ['', Validators.required], // Champ rôle
      phone: ['', Validators.required], // Champ téléphone
    });

    // Commencer le chargement
    this.isLoading = true;

    // Vérifiez si le nom d'utilisateur est présent avant de faire l'appel
    if (userId) {
      // Récupérer les informations de l'utilisateur authentifié
      this.userService.getById((userId)).subscribe(
        (user: User) => {
          console.log('Données utilisateur récupérées:', user);
          this.user = user; // Stocker l'utilisateur récupéré
          this.userForm.patchValue(user); // Remplir le formulaire avec les données utilisateur
          this.isLoading = false; // Fin de chargement
          console.log('identifiant:'+userId);
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des informations utilisateur', error);
          
        
          this.isLoading = false; // Fin de chargement même en cas d'erreur
        }
      );
    }
  }

  // Méthode pour soumettre le formulaire
  validate(): void {
    if (this.userForm.valid) {
      const updatedUser: User = {
        ...this.user,
        ...this.userForm.value,
      };

      // Mettre à jour l'utilisateur via le service
      this.userService.updateUser1(this.user.id, updatedUser).subscribe(
        () => {
          console.log('Utilisateur mis à jour avec succès');
          this.router.navigate(['/']); // Rediriger vers le profil
        },
        (error) => {
          console.error('Erreur lors de la mise à jour', error);
        }
      );
    }
  }
}
