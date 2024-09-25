import { NgModule } from '@angular/core'; // Importation de NgModule
import { RouterModule, Routes } from '@angular/router'; // Importation de RouterModule et Routes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/site/home/home.component';

// Déclaration des routes
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: '',
    component: HomeComponent,
  },



  {
    path: '',
    redirectTo: 'login', // Redirection par défaut vers login
    pathMatch: 'full' // Assure-toi que le chemin est complet
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Utilisation des routes définies
  exports: [RouterModule] // Exportation du RouterModule
})
export class AppRoutingModule { }
