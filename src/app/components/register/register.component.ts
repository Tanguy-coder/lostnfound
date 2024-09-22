import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  public isSubmited: Boolean = false

  public formData={
    name: "",
    username: "",
    email: "",
    password: "",
    confirmePassword: "",
    role: "Admin",
    telephone:""
  }

  public register(){

    this.apiService.submitRegisterUser(this.formData).subscribe(
      (response) =>{
        this.isSubmited = true
        this.responseData = response
      },
      (error) =>{
        this.errorMessage = error
      }
    )
  }
}
