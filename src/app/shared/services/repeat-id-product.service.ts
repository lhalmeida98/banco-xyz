import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepeatIdProductService implements AsyncValidator{

  private http = inject(HttpClient);
  private apiUrlBank = environment.urlApiBank;

  private strBp = 'bp/';
  private strProducts = 'products';

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
    const id = control.value;
    return this.http.get<boolean>(`${this.apiUrlBank}${this.strBp}${this.strProducts}/verification/${id}`, {
    }).pipe(
      map( response => {
        return ( response === false)
          ? null
          : {idTake: true}
      }),
      catchError(error => {
        return of({ serverError: true });
      })
    );
  }
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }
}
