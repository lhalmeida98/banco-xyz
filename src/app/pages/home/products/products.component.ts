import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FinancialProduct } from '../../../core/models/FinancialProduct';
import { ProductsService } from '../../../shared/services/products.service';
import { AutoDestroyService } from '../../../shared/util/auto-destroy.service';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ModalConfirmComponent } from '../../../shared/ui/modal-confirm/modal-confirm.component';
import { Router, RouterModule } from '@angular/router';
import { SkeletonLoaderComponent } from '../../../shared/ui/skeleton-loader/skeleton-loader.component';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { ErrorMessageComponent } from '../../../shared/ui/error-message/error-message.component';

@Component({
  selector: 'app-products',
  standalone: true,
  providers:[AutoDestroyService, NotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe ,FormsModule, ErrorMessageComponent, SkeletonLoaderComponent, NotificationComponent, ModalConfirmComponent, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export default class ProductsComponent implements OnInit {
  private productsService = inject(ProductsService);
  private destroy$ = inject(AutoDestroyService);
  private notificationService = inject(NotificationService);

  public $products = this.productsService.$products;

  public itemsPerPage: WritableSignal<number> = signal(5);
  private currentPage: WritableSignal<number> = signal(1);
  public query: WritableSignal<string> = signal('');
  public $loading: WritableSignal<boolean> = this.productsService.$loading;

  public queryChanges$: Subject<string> = new Subject<string>();

  private totalProducts: number = 0;
  public showConfirmModal = false;
  public selectedProductId: string | null = null;
  public productNameSelected: string = '';

  public errorMessage: string = '';


  constructor(private router: Router) {

  }

  ngOnInit() {
    this.listOfProduct();
    this.subscribeToInputChange();
  }

  public onItemsPerPageChange(event: any) {
    this.itemsPerPage.set(+event.target.value);
    this.currentPage.set(1);
    this.productsService.setQueryString(this.query());
  }

  public onEdit(productId: string): void {
    this.productsService.searchProduct(productId).subscribe({
      next: (product: FinancialProduct)=>{
        this.productsService.setProduct(product);
        this.router.navigate([`/home/edit-product/${productId}`]);
      },
      error: () => {
        this.notificationService.showNotification( 'Error','Error al buscar el producto. Por favor, inténtalo de nuevo.', 'error');
      },
    });


  }

  public onDelete(productId: string, productName: string): void {
    this.productNameSelected = productName
    this.selectedProductId = productId;
    this.showConfirmModal = true;
  }

  public toggleMenu(productId: string): void {
    this.selectedProductId = this.selectedProductId === productId ? null : productId;
  }


  public confirmDelete(): void {
    if (this.selectedProductId) {
      this.productsService.deleteProduct(this.selectedProductId).subscribe({
        next: () => {
          this.productsService.searchProducts(this.query(), this.itemsPerPage(), this.currentPage()).subscribe(products => {
            this.productsService.setProducts(products);
          });
          this.notificationService.showNotification( 'Exitoso','Producto eliminado con éxito', 'success');
        },
        error: (error) => {
          this.notificationService.showNotification( 'Error',`Error al eliminar producto: ${error.message}`, 'error');
        }
      });
    }
    this.showConfirmModal = false;
  }

  public get isLoading(): boolean {
    return this.$loading();
  }

  /*
  data => {
      this.productsService.setProducts(data)
      this.totalProducts = data.length;
  */

  private listOfProduct(){
    const th = this;
    this.productsService.queryString$.pipe(
      switchMap(queryString => this.productsService.searchProducts(queryString, this.itemsPerPage(), this.currentPage())),
      takeUntil(this.destroy$)
    ).subscribe({
      next:(data: FinancialProduct[]) => {
        this.productsService.setProducts(data)
        this.totalProducts = data.length;
      },
      error(err) {
        th.errorMessage = err;
      },
    }),
    catchError((error: string) => {

      this.errorMessage = error;
      return EMPTY;
    })

  }
  private subscribeToInputChange(): void {
    this.queryChanges$
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(query => this.productsService.setQueryString(query));
  }

}
