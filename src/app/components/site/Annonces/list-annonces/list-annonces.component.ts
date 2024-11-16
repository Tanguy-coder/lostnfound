import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../../services/api-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnnoncesService } from '../../../../services/annonces.service';
import { Annonces } from '../../../../models/annonces';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FilterPipe } from '../../../../filter.pipe';


@Component({
  selector: 'app-list-annonces',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, RouterLink,NgxPaginationModule,FilterPipeModule,FilterPipe],
  templateUrl: './list-annonces.component.html',
  styleUrl: './list-annonces.component.css'
})



export class ListAnnoncesComponent {

  constructor(private annoncesService: AnnoncesService,private httpClient: HttpClient , private cdref:ChangeDetectorRef){}
  public annonces:Annonces[] =[]
  public search: String = ""
  id_pub=Number(localStorage.getItem("publicateur"));
  current=Number(localStorage.getItem("currentUser"));
  page: number = 1;
  searchTerm: string = ''; // Terme de recherche
  lemail=localStorage.getItem('email');
  typeuser=(localStorage.getItem('usertype'));

  public getAnnonces(): void {
    this.annoncesService.getAnnonces().subscribe((liste) => {
      this.annonces = liste

      
    })
  }

  validerAnnonce(annonceId: number): void {
    this.httpClient.put(`http://localhost:8080/annonces/${annonceId}/valider`, {}, { responseType: 'text' })
      .subscribe({
        next: () => {
          const annonce = this.annonces.find(a => a.id === annonceId);
          if (annonce) {
            annonce.status = "true";
            this.cdref.detectChanges(); // Force la détection des changements
          }
        },
        error: (error) => {
          console.error('Erreur lors de la validation de l\'annonce', error);
        }
      });
  }
  
  
  
  
  





  public deleteAnnonce(id: number): void {
    // Utilisation de la boîte de dialogue de confirmation native du navigateur
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      this.annoncesService.deleteAnnonce(id).subscribe(() => {
        this.getAnnonces(); // Rafraîchit la liste des annonces après suppression
        alert("Annonce supprimée avec succès !"); // Affiche un message de confirmation
      }, error => {
        console.error("Erreur lors de la suppression de l'annonce :", error);
        alert("Une erreur est survenue lors de la suppression."); // Message d'erreur
      });
    } else {
      console.log("Suppression annulée."); // Journalisation si l'utilisateur annule l'action
    }
  }
  

  ngOnInit() : void{
    this.getAnnonces()

    console.log("current",this.current)
    console.log("pub"+ this.id_pub)
  }
}
