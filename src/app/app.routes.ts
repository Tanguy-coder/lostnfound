import { NgModule } from '@angular/core'; // Importation de NgModule
import { RouterModule, Routes } from '@angular/router'; // Importation de RouterModule et Routes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/site/home/home.component';
import { AuthGuard } from './auth.guard';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AnnonceComponent } from './components/site/Annonces/annonce/annonce.component';
import { ListAnnoncesComponent } from './components/site/Annonces/list-annonces/list-annonces.component';
import { MessagerieComponent } from './messagerie/messagerie.component';
import { WebSocketService } from './web-socket.service';
import { BoiteComponent } from './boite/boite.component';
import { RoleComponent } from './role/role.component';

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

    path:'form',
    component:AnnonceComponent,
    canActivate:[AuthGuard]
  },

  {

    path:'annonces/create',
    component:AnnonceComponent,
     canActivate:[AuthGuard]
  },

  {
    path:'annonces/edit/:id',
    component: AnnonceComponent,
    canActivate:[AuthGuard]
  },

  {
    path:'roles/create',
    component: RoleComponent,
    canActivate:[AuthGuard]
  },

  {
    path:'annonces',
    component: ListAnnoncesComponent
  },

  {

    path:'user/:userId',
    component:UserEditComponent,
    canActivate:[AuthGuard]


  },
  {

    path:'msg/:id/:annonce.user.id',
    component:MessagerieComponent,
    canActivate:[AuthGuard]


  },



  {
    path: '',
    component: HomeComponent,
    canActivate:[AuthGuard]
    
  },

  {
    path: 'users',
    component: UsersComponent,
    canActivate:[AuthGuard]
  },

  {
    path: 'discussions',
    component: BoiteComponent,
    canActivate:[AuthGuard]
  },



  {
    path: '',
    redirectTo: 'login', // Redirection par défaut vers login
    pathMatch: 'full' // Assure-toi que le chemin est complet
  },

  { path: 'discussion', component: BoiteComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Utilisation des routes définies
  exports: [RouterModule] // Exportation du RouterModule
})
export class AppRoutingModule { }
