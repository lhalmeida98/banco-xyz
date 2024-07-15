import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FieldValidatorService {
    public messageErrors(field: string, form: FormGroup): string | null{
      if(!form.controls[field]) return null;

      const errors = form.controls[field].errors || {};

      for(const key of Object.keys(errors)){
          switch (key){
              case 'required':
                  return 'Este campo es requerido';
              case 'minlength':
                  return `Mínimo ${ errors['minlength'].requiredLength } caracteres.`;
              case 'maxlength':
                return `Máximo ${ errors['maxlength'].requiredLength } caracteres.`;
              case 'idTake':
                  return `El ID no es válido`
              case'invalidReleaseDate':
                  return 'La fecha ingresada es incorrecta '
              case 'invalidReviewDate':
                return 'La fecha ingresada no es mayor a fecha de liberación'
              case'serverError':
                  return 'El servidor no responde'
          }
      }
      return null;
  }

  public static releaseDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const releaseDateParts = control.value.split('-');
      const releaseDate = new Date(parseInt(releaseDateParts[0]), parseInt(releaseDateParts[1]) - 1, parseInt(releaseDateParts[2]));
      releaseDate.setHours(0, 0, 0, 0);

      if (releaseDate < currentDate) {
        return { invalidReleaseDate: true };
      }
      return null;
    };
  }


  public static revisionDateValidator(releaseDateField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      if (!formGroup) return null;

      const releaseDateControl = formGroup.get(releaseDateField);
      if (!releaseDateControl) return null;

      const releaseDate = new Date(releaseDateControl.value);
      const revisionDate = new Date(control.value);

      releaseDate.setHours(0, 0, 0, 0);
      revisionDate.setHours(0, 0, 0, 0);

      const oneYearLater = new Date(releaseDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      if (revisionDate.getTime() !== oneYearLater.getTime()) {
        return { invalidReviewDate: true };
      }
      return null;
    };
  }

  public validatorInput(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  }

}
