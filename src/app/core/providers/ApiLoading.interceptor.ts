import type { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { SpinnerService } from '../../shared/services/spinner.service';
import { NotificationService } from '../../shared/services/notification.service';
import { error } from 'console';

export const apiLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((error: HttpErrorResponse) =>{

    let errorMessage = '';

    if(error.error instanceof ErrorEvent){
      errorMessage = `Error: ${error.error.message}`;
    }else{
      errorMessage = `Error código: ${error.status}, mensaje: ${error.message}`
    }

    return throwError(() => '');
    }));
};

