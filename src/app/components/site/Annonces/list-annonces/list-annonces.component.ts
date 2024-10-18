import { Component, NgModule, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../../services/api-service.service';
import { HttpClientModule } from '@angular/common/http';
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

  constructor(private annoncesService: AnnoncesService){}
  public annonces:Annonces[] =[]
  public search: String = ""
  id_pub=Number(localStorage.getItem("publicateur"));
  current=Number(localStorage.getItem("currentUser"));
  page: number = 1;
  searchTerm: string = ''; // Terme de recherche

  public getAnnonces(): void {
    this.annoncesService.getAnnonces().subscribe((liste) => {
      this.annonces = liste
    })
  }

  public deleteAnnonce(id: number): void {
    this.annoncesService.deleteAnnonce(id).subscribe(() => {
      this.getAnnonces()
    })
  }

  ngOnInit() : void{
    this.getAnnonces()

    console.log("current",this.current)
    console.log("pub"+ this.id_pub)
  }
}
