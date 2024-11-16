import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Annonces } from '../../../../models/annonces';
import { AnnoncesService } from '../../../../services/annonces.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-annonce',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './annonce.component.html',
  styleUrls: ['./annonce.component.css']
})
export class AnnonceComponent implements OnInit {

  public selectedFile: File | null = null;
  public previewUrl: string | ArrayBuffer | null = null;

  annonce: Annonces = new Annonces();
  public responseData: any = null;
  public errorMessage: string = "";
  public editMode = false;

  constructor(
    private annonceService: AnnoncesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.loadAnnonces(parseInt(id, 10));
    }
  }

  private validateForm(): boolean {
    if (!this.annonce.titre || !this.annonce.description ||
      !this.annonce.lieu || !this.annonce.date || !this.annonce.contact) {
      this.errorMessage = "Veuillez renseigner les champs obligatoires.";
      return false;
    }
    return true;
  }

  loadAnnonces(id: number): void {
    this.annonceService.getAnnonceById(id).subscribe((res: any) => {
      this.annonce = res;
      console.log(this.annonce);
    }, (error) => {
      console.log(error);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result ?? null;
      };
      reader.readAsDataURL(file);
    }
  }

  public addAnnonce(): void {
    if (!this.validateForm()) {
      return;
    }
    this.annonce.user = localStorage.getItem("currentUser") || "";
    this.annonce.status = "true";

    const formData = new FormData();
    formData.append('titre', this.annonce.titre);
    formData.append('description', this.annonce.description);
    formData.append('lieu', this.annonce.lieu);
    formData.append('date', this.annonce.date);
    formData.append('contact', this.annonce.contact);
    formData.append('user', this.annonce.user);
    formData.append('status', this.annonce.status ? 'true' : 'false');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.editMode) {
      this.annonceService.updateAnnonce(this.annonce).subscribe((res: any) => {
        this.responseData = res;
        this.router.navigate(['/annonces']);
      }, (error) => {
        this.errorMessage = error;
      });

    } else {
      this.annonceService.createAnnonce(formData).subscribe(
        (res: any) => {
          this.responseData = res;
          localStorage.setItem('publicateur', this.responseData.user.id.toString());
          localStorage.setItem('idannonce', this.responseData.id.toString());
          this.router.navigate(['/annonces']);
        },
        (error) => {
          this.errorMessage = error.error.message;
        });
    }
  }

  private getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.annonce.latitude = position.coords.latitude;
            this.annonce.longitude = position.coords.longitude;
            resolve(this.annonce);
          },
          (error) => {
            console.log(error);
            reject(error);
          }
        );
      } else {
        reject('Ce navigateur ne supporte pas la géolocalisation');
      }
    });
  }
}
