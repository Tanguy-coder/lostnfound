import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorServiceService {

  constructor(private http: HttpClient) { }
  public errorMessage: any 
  handleHttpError(error: any) {
    if (error.status === 500) {
      const errorMessage = error.error.message || 'Internal Server Error';
      console.error('Error message:', errorMessage);
      this.errorMessage = errorMessage;
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
  }
}
