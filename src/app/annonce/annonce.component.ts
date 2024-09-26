import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../components/register/register.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from "../components/login/login.component";

@Component({
  selector: 'app-annonce',
  standalone: true,
  imports: [RegisterComponent, LoginComponent],
  templateUrl: './annonce.component.html',
  styleUrl: './annonce.component.css'
})
export class AnnonceComponent {

}
