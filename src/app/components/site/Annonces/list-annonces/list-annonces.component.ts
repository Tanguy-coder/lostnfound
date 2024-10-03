import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../../services/api-service.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnnoncesService } from '../../../../services/annonces.service';
import { Annonces } from '../../../../models/annonces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-annonces',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './list-annonces.component.html',
  styleUrl: './list-annonces.component.css'
})
export class ListAnnoncesComponent {

  constructor(private annoncesService: AnnoncesService){}
  public annonces:Annonces[] =[]
  public search: String = ""

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
  }
}
