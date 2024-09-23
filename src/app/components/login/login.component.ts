import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private apiService: ApiServiceService){}
  public responseData: any = null
  public errorMessage: String = ""
  public successMessage: String = ""
  public formData = {
    email : "",
    password: ""
  }

  private validateForm():Boolean {
    if (!this.formData.email || !this.formData.password) {
      this.errorMessage = "Veillez renseigner tous les champs"
      return false
    }
    return true
  }

  public login(){
    if (!this.validateForm()) {
      return
    }

    this.apiService.submitLoginUser(this.formData).subscribe({
      next: (response) =>{
        this.responseData = response
        console.log(response)
      },
      error : (error)=>{
        this.errorMessage= error.message
        console.log(error)
      },
      complete: ()=>{
        this.successMessage = "Connexion réussie"
      }
    })
  }

}
