import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Annonces } from '../../../../models/annonces';
import { AnnoncesService } from '../../../../services/annonces.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-annonce',
  standalone: true,
  imports: [ CommonModule,FormsModule],
  templateUrl: './annonce.component.html',
  styleUrl: './annonce.component.css'
})
export class AnnonceComponent {

  constructor(
      private annonceService : AnnoncesService,
      private route: ActivatedRoute,
      private router: Router
    ){}

  public selectedFile: File | null = null;
  public previewUrl: string | ArrayBuffer | null = null;

  annonce : Annonces = new Annonces();
  public responseData: any =null
  public errorMessage: String =""
  public editMode = false
  



  private validateForm(): boolean {
    if (!this.annonce.titre || !this.annonce.description ||
      !this.annonce.lieu || !this.annonce.date || !this.annonce.contact) {
      this.errorMessage = "Veuillez renseigner les champs obligatoires.";
      return false;
    }
    return true;
  }

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.editMode = true
      this.loadAnnonces(parseInt(id))
    }

  }

  loadAnnonces(id:number ):void{
    this.annonceService.getAnnonceById(id).subscribe((res: any) => {
      this.annonce = res
      console.log(this.annonce)
    }, (error) => {
      console.log(error)
    })

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
      return
    }
    this.annonce.user = localStorage.getItem("currentUser") || "";
    const formData = new FormData();
    formData.append('titre', this.annonce.titre);
    formData.append('description', this.annonce.description);
    formData.append('lieu', this.annonce.lieu);
    formData.append('date', this.annonce.date);
    formData.append('contact', this.annonce.contact);
    formData.append('user', this.annonce.user);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

    if (this.editMode) {
      this.annonceService.updateAnnonce(this.annonce).subscribe((res: any) => {
        this.responseData = res
        console.log(res)
        this.router.navigate(['/annonces'])
      }, (error) => {
        console.log(error)
        this.errorMessage = error
      })

    } else {
      this.annonceService.createAnnonce(formData).subscribe(
        (res: any) => {
          this.responseData = res
          console.log(res);
          Number(localStorage.setItem('publicateur', this.responseData.userId));
           Number(localStorage.setItem('publicateur', this.responseData.user.id))
          localStorage.setItem('idannonce',this.responseData.id);
          this.router.navigate(['/annonces'])
        },
        (error) => {
          console.log(error)
          this.errorMessage = error.error.message
        })
    }

  }

  private getCurrentPosition(){
    return new Promise((resolve, reject)=>{
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position)=>{
            if (position) {
              this.annonce.latitude = position.coords.latitude
              this.annonce.longitude = position.coords.longitude
              console.log(this.annonce)
              resolve(this.annonce)
            }
          },
          (error) => console.log(error)
        )}else{
          reject('Ce navigateur ne supporte pas la géolocalisation')
        }
    })
  }

}
