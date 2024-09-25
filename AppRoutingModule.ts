import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './src/app/components/login/login.component'; // Ton composant cible
import { RegisterComponent } from './src/app/components/register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'register',component: RegisterComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Autres routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
