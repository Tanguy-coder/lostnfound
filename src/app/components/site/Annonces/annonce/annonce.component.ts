import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../../../register/register.component';
import { LoginComponent } from "../../../login/login.component";
import { FormsModule } from '@angular/forms';
import { Annonces } from '../../../../models/annonces';
import { AnnoncesService } from '../../../../services/annonces.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-annonce',
  standalone: true,
  imports: [RegisterComponent, LoginComponent, CommonModule,FormsModule],
  templateUrl: './annonce.component.html',
  styleUrl: './annonce.component.css'
})
export class AnnonceComponent {

  constructor(
      private annonceService : AnnoncesService,
      private route: ActivatedRoute,
      private router: Router
    ){}

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

  public addAnnonce(): void {
    if (!this.validateForm()) {
      return
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
      this.annonceService.createAnnonce(this.annonce).subscribe(
        (res: any) => {
          this.responseData = res
          console.log(res)
          this.router.navigate(['/annonces'])
        },
        (error) => {
          console.log(error)
          this.errorMessage = error
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
