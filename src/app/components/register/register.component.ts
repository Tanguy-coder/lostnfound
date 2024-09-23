import { HttpClientModule } from '@angular/common/http';
import { Component , OnInit} from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorServiceService } from '../../services/error-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private apiService : ApiServiceService){}
  public responseData: any = null
  public errorMessage: String = ""
  public passwordMessage :String = ""
  public isSubmited: Boolean = false

  public formData={
    name: "",
    username: "",
    email: "",
    password: "",
    confirmePassword: "",
    role: "",
    telephone:""
  }

  public roles: any = []

  private validateForm(): boolean {
    if (!this.formData.name || !this.formData.username || !this.formData.email
      || !this.formData.password || !this.formData.confirmePassword || !this.formData.role
      || !this.formData.telephone) {
      this.errorMessage = "Veuillez renseigner les champs obligatoires.";
      return false;
    }

    if (this.formData.password !== this.formData.confirmePassword) {
      this.passwordMessage = "Les mots de passe ne correspondent pas.";
      return false;
    }

    return true;
  }


  public register(){
    if (!this.validateForm()) {
      return;
    }
    this.apiService.submitRegisterUser(this.formData).subscribe({
      next:(response) =>{
        this.isSubmited = true
        this.responseData = response.data
      },
      error: (error) =>{
        this.errorMessage = error.error.message
      },
      complete : ()=> console.log('completed')
    })
  }

  ngOnInit():void{
    this.apiService.getRoles().subscribe(
      (response) =>{
        this.roles = response
      }, (error)=>console.log(error)
    )
  }
}
