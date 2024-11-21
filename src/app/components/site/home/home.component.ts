import { Component, OnInit } from '@angular/core';
import { User } from '../../../users.service';
import { AnnoncesService } from '../../../services/annonces.service';
import { Annonces } from '../../../models/annonces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css',]
})
export class HomeComponent {

  constructor(
    private annonceService : AnnoncesService,
  ){}

  annonces : Annonces[] = []

  users: User[] = [];

  ngOnInit(): void {
    this.getAnnonces();
  }
  getAnnonces() : void {
    this.annonceService.getLatestAnnonces().subscribe(liste => {
      this.annonces = liste;
      console.log(this.annonces)
    })
  }

}
