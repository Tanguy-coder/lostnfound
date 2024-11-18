import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService,User } from '../../users.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public currentUser:any
  public responseData: any = null
  public errorMessage: String = ""
  public successMessage: String = ""
  public formData = {
    email: "",
    password: ""
  };


  constructor(private apiService: ApiServiceService, private router: Router,private userService:UserService) {}

  public login() {
    this.apiService.loginUser(this.formData).subscribe({
      next: (response) => {
        this.responseData = response;
        console.log('Login successful', response);
        localStorage.setItem('currentUser',response.id);
        localStorage.setItem('email',response.email);
        localStorage.setItem('usertype',String(response.role.name));
        console.log('la valeur de current:'+localStorage.getItem('currentUser'));
        
        console.log("usertype:"+localStorage.getItem('usertype'));
        
        
      
        localStorage.setItem('authToken', 'authToken'); //respecter le nom du token a droite
        
        
        
        
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erreur durant le login:', error);
        this.errorMessage = error.error.message || 'Login failed. Please check your credentials.';
      }
    });
  }

}




