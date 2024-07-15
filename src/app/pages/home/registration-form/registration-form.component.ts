import { Component, inject, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../shared/services/products.service';
import { FinancialProduct } from '../../../core/models/FinancialProduct';
import { NgClass } from '@angular/common';
import { ModalConfirmComponent } from '../../../shared/ui/modal-confirm/modal-confirm.component';
import { RepeatIdProductService } from '../../../shared/services/repeat-id-product.service';
import { FieldValidatorService } from '../../../shared/services/fieldValidator.service';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { catchError, EMPTY } from 'rxjs';
import { ErrorMessageComponent } from '../../../shared/ui/error-message/error-message.component';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  providers:[NotificationComponent],
  imports: [ReactiveFormsModule,FormsModule, ErrorMessageComponent,NgClass,NotificationComponent, ModalConfirmComponent],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export default class RegistrationFormComponent {

  private fb =  inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  public fieldValidator = inject(FieldValidatorService);
  private notificationService = inject(NotificationService);
  private spinner = inject(SpinnerService);

  public productForm: FormGroup;
  public errorMessage: string | null = null;
  public idExists = false;
  public isEditing = false;

  constructor() {
    this.spinner.hide();
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)],[new RepeatIdProductService()]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, FieldValidatorService.releaseDateValidator()]],
      date_revision: [{ value: '', disabled: true }, [Validators.required]]
      },
    );
    this.productForm.get('date_release')?.valueChanges.subscribe(releaseDate => {
      this.updateRevisionDate(releaseDate);
    });

    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.isEditing = true;
        this.loadProduct(productId);
      }
    });
  }

  public navigateHome(): void {
    this.router.navigate(['/home']);
  }

  private loadProduct(productId: string) {
    const product = this.productsService.$product()

    if(product.id  !== ''){
      this.productForm.patchValue(product);
      this.productForm.get('id')?.disable();

    }else{
      this.productsService.searchProduct(productId).subscribe({
        next: (product: FinancialProduct) => {
          this.productForm.patchValue(product);
          this.productForm.get('id')?.disable();
        }
      }),
      catchError((error: string) => {

        this.errorMessage = error;
        return EMPTY;
      })
    }
  }

  private updateRevisionDate(releaseDate: string) {
    if (releaseDate) {
      const date = new Date(releaseDate);
      const oneYearLater = new Date(date.setFullYear(date.getFullYear() + 1));
      this.productForm.get('date_revision')?.setValue(oneYearLater.toISOString().split('T')[0]);
    } else {
      this.productForm.get('date_revision')?.setValue('');
    }
  }


  public getFieldError(field: string): string | null {
    return this.fieldValidator.messageErrors(field, this.productForm);
}
  public onSubmit(): void {
    if (this.productForm.valid) {
      const newProduct: FinancialProduct = this.productForm.getRawValue();
      if (this.isEditing) {
        delete this.productForm.get('id')?.errors?.['idTake'];

        this.productsService.updateProduct(newProduct.id, newProduct).subscribe({
          next: () => {
            this.notificationService.showNotification('Éxito', 'Producto actualizado exitosamente', 'success');
            this.router.navigate(['/home']);
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.notificationService.showNotification('Error', 'Hubo un problema al actualizar el producto '+ this.errorMessage, 'error');
          },
        });

      } else {
        this.productsService.addProduct(newProduct).subscribe({
          next: () => {
            this.notificationService.showNotification('Éxito', 'Producto agregado exitosamente', 'success');
            this.router.navigate(['/home']);
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.notificationService.showNotification('Error', 'Hubo un problema al agregar el producto', 'error');
          }
        });
      }
    } else {
      this.notificationService.showNotification('Advertencia', 'No se pudo guardar los datos, hay campos inválidos', 'warning');
    }
}

  onReset(): void {
    this.productForm.reset();
    this.errorMessage = null;
    this.isEditing = false;
  }


}
