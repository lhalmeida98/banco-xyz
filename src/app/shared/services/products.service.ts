import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal, Signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, delay, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { FinancialProduct } from '../../core/models/FinancialProduct';
import { response } from 'express';
import {toObservable} from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrlBank = environment.urlApiBank;

  public $products: WritableSignal<FinancialProduct[]> = signal([]);
  public $product: WritableSignal<FinancialProduct> = signal(this.initializeProduct());

  private queryString: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public queryString$ = this.queryString.asObservable();
  public $loading: WritableSignal<boolean> = signal(false);

  private strBp = 'bp/';
  private strProducts = 'products';

  public searchProducts(nameProduct: string = '', itemsPerPage: number = 5, page: number = 1): Observable<FinancialProduct[]> {
    this.$loading.set(true);
    return this.http.get<{ data: FinancialProduct[] }>(`${this.apiUrlBank}${this.strBp}${this.strProducts}`)
      .pipe(
        delay(1000),
        map(response => {
          let products = response.data;
          if (nameProduct) {
            products = products.filter(product =>
              product.name.toLowerCase().includes(nameProduct.toLowerCase())
            );
          }
          const startIndex = (page - 1) * itemsPerPage;
          return products.slice(startIndex, startIndex + itemsPerPage);
        }),
        finalize(() => this.$loading.set(false)),
        catchError(ProductsService.handleError)
      );
  }

  public searchProduct(id: string): Observable<FinancialProduct> {
    this.$loading.set(true);
    return this.http.get<{ data: FinancialProduct[] }>(`${this.apiUrlBank}${this.strBp}${this.strProducts}`)
      .pipe(
        map(response => {
          const products = response.data;
          const foundProduct = products.find(product => product.id === id);
          if (foundProduct) {
            return foundProduct;
          } else {
            throw new Error(`Producto con ID '${id}' no encontrado`);
          }
        }),
        finalize(() => this.$loading.set(false)),
        catchError(ProductsService.handleError)
      );
  }

  public addProduct(product: FinancialProduct): Observable<FinancialProduct> {
    this.$loading.set(true);
    return this.http.post<FinancialProduct>(`${this.apiUrlBank}${this.strBp}${this.strProducts}`, product)
      .pipe(
        finalize(() => this.$loading.set(false)),
        catchError(ProductsService.handleError)
      );
  }

  public updateProduct(id: string, product: FinancialProduct): Observable<FinancialProduct> {
    this.$loading.set(true);
    return this.http.put<FinancialProduct>(`${this.apiUrlBank}${this.strBp}${this.strProducts}/${id}`, product)
      .pipe(
        finalize(() => this.$loading.set(false)),
        catchError(ProductsService.handleError)
      );
  }

  public deleteProduct(id: string): Observable<void> {
    this.$loading.set(true);
    return this.http.delete<void>(`${this.apiUrlBank}${this.strBp}${this.strProducts}/${id}`)
      .pipe(
        finalize(() => this.$loading.set(false)),
        catchError(ProductsService.handleError)
      );
  }

  public setProducts(products: FinancialProduct[]) {
    this.$products.set(products);
  }

  public setProduct(product: FinancialProduct){
    this.$product.set(product);
  }

  public setQueryString(queryString: string): void {
    this.queryString.next(queryString);
  }

  private static handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A ocurrido un error: ${error.error.message}`;
    } else {
      errorMessage = `El servidor retorna código ${error.status}, cuerpo de error: ${error.error}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  private initializeProduct(): FinancialProduct {
    return {
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: new Date(),
      date_revision: new Date()
    };
  }

}
