import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import ProductsComponent from './products.component';
import { ProductsService } from '../../../shared/services/products.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FinancialProduct } from '../../../core/models/FinancialProduct';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: ProductsService;
  let notificationService: NotificationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ProductsComponent,
      ],
      providers: [
        ProductsService,
        NotificationService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    notificationService = TestBed.inject(NotificationService);

    spyOn(productsService, 'searchProducts').and.returnValue(of([]));
    spyOn(productsService, 'setProducts');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchProducts on init', () => {
    expect(productsService.searchProducts).toHaveBeenCalled();
  });


  it('should navigate to edit product on edit', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    const dummyProduct: FinancialProduct = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: new Date(),
      date_revision: new Date(),
    };
    spyOn(productsService, 'searchProduct').and.returnValue(of(dummyProduct));

    component.onEdit('1');
    expect(productsService.searchProduct).toHaveBeenCalledWith('1');
    expect(navigateSpy).toHaveBeenCalledWith(['/home/edit-product/1']);
  });
});
